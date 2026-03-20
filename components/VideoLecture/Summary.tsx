
import React, { useEffect } from 'react';
import useChatbot from '../../contexts/useChatbot';
import MarkdownWithTimestamps from '../markdown/MarkdownWithTimestamps';

interface SummaryProps {
    videoId: string;
}

const Summary: React.FC<SummaryProps> = ({ videoId }) => {
    const { summaryHtml, fetchSummary, loading } = useChatbot();

    useEffect(() => {
        fetchSummary(videoId);
    }, [fetchSummary, videoId]);
    const onSeek = (time: string) => {
        console.log("Seek to:", time);
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
    }
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
                            onSeek={onSeek}
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
