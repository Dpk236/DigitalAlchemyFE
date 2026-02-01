
import React, { useEffect, useRef } from 'react';

interface TranscriptItem {
    time: string;
    startTime: number;
    text: string;
}

interface TranscriptListProps {
    transcript: TranscriptItem[];
    currentTime: number;
    onSeek: (time: string) => void;
}

const TranscriptList: React.FC<TranscriptListProps> = ({ transcript, currentTime, onSeek }) => {
    const activeRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentTime]);

    // Find the active segment index
    const activeIndex = transcript.findIndex((item, index) => {
        const nextItem = transcript[index + 1];
        return currentTime >= item.startTime && (!nextItem || currentTime < nextItem.startTime);
    });

    return (
        <div
            ref={containerRef}
            className="mt-8 space-y-4 overflow-y-auto pr-4 scrollbar-hide"
            style={{ maxHeight: 'calc(100vh - 560px)' }}
        >
            {transcript.map((line, i) => {
                const isActive = i === activeIndex;
                return (
                    <div
                        key={i}
                        ref={isActive ? activeRef : null}
                        className={`flex gap-4 group cursor-pointer p-3 rounded-2xl transition-all duration-300 ${isActive
                            ? 'bg-blue-50 border border-blue-100 shadow-sm'
                            : 'hover:bg-gray-50'
                            }`}
                        onClick={() => onSeek(line.time)}
                    >
                        <span className={`text-xs font-bold w-12 pt-0.5 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400'
                            }`}>
                            {line.time}
                        </span>
                        <p className={`text-sm leading-relaxed flex-1 transition-colors ${isActive ? 'text-blue-900 font-medium' : 'text-gray-600'
                            }`}>
                            {line.text}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default TranscriptList;
