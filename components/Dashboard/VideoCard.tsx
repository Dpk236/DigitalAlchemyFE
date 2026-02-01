
import React from 'react';

interface VideoCardProps {
    title: string;
    subject: string;
    topic: string;
    date: string;
    time: string;
    thumbnail: string;
    onPlay: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, subject, topic, date, time, thumbnail, onPlay }) => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative aspect-[16/9]">
                <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {subject}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {topic}
                    </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-4 min-h-[56px]">
                    {title}
                </h3>
                <div className="flex items-center gap-4 text-gray-400 text-xs font-bold mb-6">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {time}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button
                        onClick={onPlay}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-sm uppercase tracking-wider transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 5.5V18.5L19 12L7 5.5Z" />
                            </svg>
                        </div>
                        Play
                    </button>
                    <button className="text-gray-300 hover:text-gray-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
