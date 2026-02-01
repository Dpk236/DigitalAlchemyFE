
import React, { useState, useEffect, useRef } from 'react';
import { explainConcept, generateTTS, generateVisualExplanation } from '../services/gemini';
import { Language } from '../types';

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

const AICompanion: React.FC<AICompanionProps> = ({ isOpen, onClose, context }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string; type?: 'text' | 'image' | 'audio' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('english');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setIsLoading(true);

    try {
      const explanation = await explainConcept(userMsg, context || "General academic context", language);
      setMessages(prev => [...prev, { role: 'ai', content: explanation, type: 'text' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualRequest = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await generateVisualExplanation(messages[messages.length - 1]?.content || "Educational diagram");
      setMessages(prev => [...prev, { role: 'ai', content: imageUrl, type: 'image' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: "Could not generate visual.", type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTSRequest = async () => {
    const lastMsg = messages.filter(m => m.role === 'ai' && m.type === 'text').pop();
    if (!lastMsg) return;

    setIsLoading(true);
    try {
      const audioBuffer = await generateTTS(lastMsg.content.substring(0, 1000));
      const blob = new Blob([audioBuffer], { type: 'audio/pcm' });
      
      // Since it's raw PCM, we'd typically need a custom player as per guidelines, 
      // but for this demo UI we'll use a simplified flow or mention it.
      // Guidelines say: use decodeAudioData helper.
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const dataInt16 = new Int16Array(audioBuffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
      
      setMessages(prev => [...prev, { role: 'ai', content: "Playing audio explanation...", type: 'text' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 animate-slide-in">
      <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
        <div>
          <h2 className="font-bold flex items-center gap-2">
            <span className="animate-pulse">✨</span> AI Learning Companion
          </h2>
          <p className="text-xs text-blue-100 opacity-80">Connected to current context</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-blue-700 rounded transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💡</div>
            <p className="text-gray-500 font-medium">How can I help you understand this concept better?</p>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button onClick={() => setQuery("Explain this like I'm five")} className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50 text-gray-600">"Explain this like I'm five"</button>
              <button onClick={() => setQuery("What are common mistakes here?")} className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50 text-gray-600">"What are common mistakes here?"</button>
              <button onClick={() => setQuery("Give me a real-world example")} className="text-sm border rounded-full px-4 py-2 hover:bg-gray-50 text-gray-600">"Give me a real-world example"</button>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}>
              {m.type === 'image' ? (
                <img src={m.content} alt="Visual explanation" className="rounded-lg shadow-sm" />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t space-y-3">
        <div className="flex gap-2">
          <button onClick={handleVisualRequest} className="flex-1 text-xs border border-gray-200 py-1.5 rounded flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            🖼️ Visualize
          </button>
          <button onClick={handleTTSRequest} className="flex-1 text-xs border border-gray-200 py-1.5 rounded flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
            🔊 Listen
          </button>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="text-xs border border-gray-200 py-1.5 rounded bg-white px-2"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
          />
          <button type="submit" className="absolute right-2 top-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICompanion;
