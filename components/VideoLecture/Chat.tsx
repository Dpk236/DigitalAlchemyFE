
import React, { useRef, useEffect, useState } from 'react';
import { socket } from '../socket/socket';
import MarkdownWithTimestamps from '../markdown/MarkdownWithTimestamps';

import useChatbot from '../../contexts/useChatbot';

interface ChatMessage {
    role: 'user' | 'assistant' | 'typing';
    text: string;
    type?: string;
    cross_questions?: string[];
}

const Chat: React.FC = () => {
    const { chatMessages, fetchAllChats, loading: historyLoading } = useChatbot();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const userId = "user123";
    const lectureId = "lecture456";
    const sessionId = "session789";
    console.log("chatMessages", chatMessages);
    // Fetch history on mount
    useEffect(() => {
        fetchAllChats();
    }, [fetchAllChats]);

    // Sync history to local state
    useEffect(() => {
        if (chatMessages && chatMessages.length > 0) {
            const transformedMessages: ChatMessage[] = chatMessages.map((item: any) => ({
                role: item?.role,
                text: item?.content,
                type: item?.type,
                cross_questions: item?.cross_questions,
            }));
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

    const sendMessage = (text?: string) => {
        const finalMessage = text ?? query;
        if (!finalMessage.trim() || isThinking) return;

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
                                    m.text
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-8 pt-0 mt-auto">
                <form onSubmit={handleSendChat} className="shrink-0 relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={isThinking ? "Thinking..." : "Analyze this concept..."}
                        disabled={isThinking}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={isThinking}
                        className={`absolute right-3 top-3 p-2 rounded-xl shadow-lg transition-transform ${isThinking ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:scale-105 shadow-blue-500/40'}`}
                    >
                        <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
