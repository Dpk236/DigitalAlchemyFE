
import React, { useRef, useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import MarkdownWithTimestamps from '../markdown/MarkdownWithTimestamps';

import useChatbot from '../../contexts/useChatbot';
import { uploadQuestionImage } from '../../services/api';

interface ChatMessage {
    role: 'user' | 'assistant' | 'typing';
    text: string;
    type?: string;
    cross_questions?: string[];
    hasImage?: boolean;
}

interface ChatProps {
    videoId: string;
}

const Chat: React.FC<ChatProps> = ({ videoId }) => {
    const { chatMessages, fetchAllChats, loading: historyLoading } = useChatbot();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const userId = "user123";
    const lectureId = videoId;
    const sessionId = "session789";
    console.log("chatMessages", chatMessages);
    // Fetch history on mount
    useEffect(() => {
        fetchAllChats(videoId);
    }, [fetchAllChats, videoId]);

    // Sync history to local state
    useEffect(() => {
        if (chatMessages && chatMessages.length > 0) {
            const transformedMessages: ChatMessage[] = chatMessages.map((item: any) => {
                let content = item?.content || "";
                let hasImage = false;
                
                // Regex to catch [Image Upload], [Image Uploaded], [Image Attachment], etc.
                const imageRegex = /\[Image (?:Upload|Uploaded|Attachment)\]|📷/i;
                
                if (imageRegex.test(content)) {
                    content = content.replace(imageRegex, "").trim();
                    hasImage = true;
                }

                return {
                    role: item?.role,
                    text: content,
                    type: item?.type,
                    cross_questions: item?.cross_questions,
                    hasImage: hasImage || item?.hasImage
                };
            });
            setMessages(transformedMessages);
        }
    }, [chatMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, []);


    const streamAssistantResponse = (fullText: string, type: string, crossQuestions: string[] = []) => {
        const words = fullText.split(" ");
        let index = 0;

        setMessages((prev) => [
            ...prev.filter((m) => m.role !== "typing"),
            {
                role: "assistant",
                text: "",
                type: type,
                cross_questions: crossQuestions,
            },
        ]);

        typingIntervalRef.current = setInterval(() => {
            setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];

                if (last && last.role === 'assistant') {
                    if (index < words.length) {
                        last.text += (index === 0 ? "" : " ") + words[index++];
                    } else {
                        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
                        setIsThinking(false);
                    }
                }
                return updated;
            });
        }, 35);
    };

    useEffect(() => {
        const handleChatResponse = (res: string) => {
            const response = JSON.parse(res);
            const { type, ai_response, data } = response || {};
            const { cross_questions } = data || {};
            console.log("Received chat_response:", response);

            if (type == "clarification") {
                streamAssistantResponse(ai_response, type, cross_questions || []);
            } else {
                streamAssistantResponse(ai_response, type);
            }
        };

        socket.on("chat_response", handleChatResponse);

        return () => {
            socket.off("chat_response", handleChatResponse);
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, []);

    const sendMessage = async (text?: string) => {
        const finalMessage = text ?? query;
        if ((!finalMessage.trim() && !selectedFile) || isThinking) return;

        // If there's an image, we use the POST endpoint
        if (selectedFile) {
            setIsThinking(true);
            setIsUploading(true);

            setMessages((prev) => [
                ...prev,
                { role: "user", text: finalMessage.trim(), hasImage: true },
                { role: "typing", text: "AI IS PROCESSING IMAGE..." },
            ]);

            try {
                const response = await uploadQuestionImage(selectedFile, userId, lectureId, sessionId, finalMessage);
                
                // Remove typing indicator and placeholder if needed (though backend might return history)
                setMessages(prev => prev.filter(m => m.role !== "typing"));
                
                // Update with the final extracted text result if we want to show what OCR found
                // For now just stream the assistant response
                streamAssistantResponse(response.ai_response, response.type || "context_retrieval");
                
                // Clear selected file
                setSelectedFile(null);
                setPreviewUrl(null);
                setQuery("");
            } catch (error) {
                console.error("Upload error:", error);
                setMessages(prev => [
                    ...prev.filter(m => m.role !== "typing"),
                    { role: "assistant", text: "Sorry, I couldn't process that image. Please try again." }
                ]);
                setIsThinking(false);
            } finally {
                setIsUploading(false);
            }
            return;
        }

        // Regular text-only socket message
        setMessages((prev) => [
            ...prev,
            { role: "user", text: finalMessage },
            { role: "typing", text: "AI IS PROCESSING..." },
        ]);

        setIsThinking(true);
        socket.emit("chat_message", {
            user_id: userId,
            lecture_id: lectureId,
            session_id: sessionId,
            message: finalMessage,
        });

        setQuery("");
    };

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isThinking || isUploading) return;

        // Revoke old URL if exists
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSeek = (time: string) => {
        console.log("Seek to:", time);
        // Implement video seek logic if video ref is available globally or passed via context
        const video = document.querySelector('video');
        if (!video) return;

        const parts = time.split(":").map(Number);
        let seconds = 0;
        if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        video.currentTime = seconds;
        video.play();
    };


    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex-1 space-y-6 overflow-y-auto p-8 pr-6 scrollbar-hide" ref={scrollRef}>
                {historyLoading && messages.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-12 h-12 border-4 border-gray-50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Restoring Chat History...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20 px-10">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl rotate-3 shadow-lg shadow-blue-500/10">✨</div>
                        <h4 className="font-black text-gray-900 mb-2">Academic Assistant</h4>
                        <p className="text-sm text-gray-400">Stuck at a timestamp? Ask me to explain it using simpler language or examples.</p>
                    </div>
                ) : null}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'typing' ? (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-full px-5 py-2 text-[10px] font-bold text-gray-400 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                    {m.text}
                                </div>
                            </div>
                        ) : (
                            <div className={`max-w-[90%] px-5 py-3.5 rounded-3xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-500/20' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                }`}>
                                {m.role === 'assistant' ? (
                                    <div>
                                        <MarkdownWithTimestamps content={m.text} onSeek={onSeek} isDarkMode={false} />
                                        {m.cross_questions && m.cross_questions.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {m.cross_questions.map((q, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => sendMessage(q)}
                                                        className="text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors text-left"
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {m.hasImage && (
                                            <div className="shrink-0 bg-white/20 p-1.5 rounded-lg">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className={m.hasImage ? "font-medium" : ""}>{m.text || (m.hasImage ? "Image shared" : "")}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-8 pt-0 mt-auto">
                {previewUrl && (
                    <div className="mb-4 relative inline-block">
                        <img src={previewUrl} alt="Upload Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-blue-500 shadow-lg" />
                        <button 
                            onClick={removeFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
                <form onSubmit={handleSendChat} className="shrink-0 relative group flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isThinking || isUploading}
                        className={`p-4 border rounded-2xl transition-colors flex items-center justify-center shrink-0 ${selectedFile ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        title="Attach Question Image"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isThinking ? "Thinking..." : selectedFile ? "Ask about this image..." : "Analyze this concept..."}
                            disabled={isThinking}
                            className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={isThinking || (!query.trim() && !selectedFile)}
                            className={`absolute right-3 top-3 p-2 rounded-xl shadow-lg transition-transform ${isThinking || (!query.trim() && !selectedFile) ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:scale-105 shadow-blue-500/40'}`}
                        >
                            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
