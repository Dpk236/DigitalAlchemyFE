
import React, { useEffect } from 'react';
import useChatbot from '../../contexts/useChatbot';
import MarkdownWithTimestamps from '../markdown/MarkdownWithTimestamps';

const Summary: React.FC = () => {
    const { summaryHtml, fetchSummary, loading } = useChatbot();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            <h2 className="text-2xl font-black text-gray-900 leading-none tracking-tight flex gap-2">Lecture <br /><span className="text-blue-600">Summary</span></h2>

            {loading ? (
                <div className="p-20 text-center">
                    <div className="w-12 h-12 border-4 border-gray-50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating Summary...</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {summaryHtml ? (
                        <MarkdownWithTimestamps
                            content={summaryHtml}
                            isDarkMode={false}
                            onSeek={(timestamp) => console.log("Seek to:", timestamp)}
                        />
                    ) : (
                        <p className="text-gray-500 italic">No summary available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Summary;
