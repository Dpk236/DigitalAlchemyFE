import React from 'react';
import { Play, Atom, Heart } from 'lucide-react';

interface VideoCardProps {
    id?: string;
    title: string;
    subject: string;
    topic: string;
    date: string;
    time: string;
    thumbnail: string;
    onPlay: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, subject, topic, date, time, thumbnail, onPlay }) => {
    const renderVisual = () => {
        switch (id) {
            case 'waves':
                return (
                    <div className="relative flex items-center justify-center w-full h-full">
                        <svg viewBox="0 0 200 100" className="w-56 h-28 drop-shadow-[0_0_8px_rgba(38,99,235,0.8)] overflow-visible">
                            <path
                                d="M 0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50"
                                fill="none"
                                stroke="#2663EB"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="animate-wave-draw"
                            />
                            <path
                                d="M 0 50 Q 25 90 50 50 T 100 50 T 150 50 T 200 50"
                                fill="none"
                                stroke="#FFFF00"
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="animate-wave-draw-reverse opacity-70"
                                style={{ animationDuration: '3s' }}
                            />
                        </svg>
                        <style>{`
                  .animate-wave-draw {
                    stroke-dasharray: 250;
                    stroke-dashoffset: 250;
                    animation: waveDraw 2s linear infinite alternate;
                  }
                  .animate-wave-draw-reverse {
                     stroke-dasharray: 250;
                     stroke-dashoffset: 250;
                     animation: waveDraw 2.5s linear infinite alternate-reverse;
                  }
                  @keyframes waveDraw {
                    0% { stroke-dashoffset: 250; }
                    100% { stroke-dashoffset: 0; }
                  }
                `}</style>
                    </div>
                );
            case 'projectile_motion':
                return (
                    <div className="relative flex items-center justify-center w-full h-full">
                        <div className="relative w-56 h-32 border-b-2 border-white/20">
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 100%' }}></div>
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                <path
                                    d="M 10 128 Q 110 -20 210 128"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    className="opacity-30"
                                />
                                <circle r="8" fill="#FFFF00" stroke="black" strokeWidth="2" className="animate-ball shadow-[0_0_10px_rgba(255,255,0,0.8)]">
                                </circle>
                            </svg>
                            <div className="absolute -right-2 bottom-0 w-4 h-1 bg-red-500"></div>
                        </div>
                        <style>{`
                   .animate-ball {
                      offset-path: path("M 10 128 Q 110 -20 210 128");
                      animation: followPath 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                   }
                   @keyframes followPath {
                     0% { offset-distance: 0%; opacity: 0; scale: 0.5; }
                     10% { opacity: 1; scale: 1; }
                     90% { opacity: 1; scale: 1; }
                     100% { offset-distance: 100%; opacity: 0; scale: 0.5; }
                   }
                 `}</style>
                    </div>
                );
            case 'human_heart':
                return (
                    <div className="relative flex items-center justify-center w-full h-full">
                        <div className="relative">
                            <Heart
                                size={100}
                                className="text-red-500 fill-red-500 animate-pulse-fast drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                                strokeWidth={1.5}
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 overflow-hidden flex items-center">
                                <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                                    <path
                                        d="M 0 10 L 10 10 L 15 5 L 20 15 L 25 10 L 35 10"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        className="animate-ecg"
                                    />
                                </svg>
                            </div>
                        </div>
                        <style>{`
                  .animate-pulse-fast {
                    animation: pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                  }
                  .animate-ecg {
                    stroke-dasharray: 40;
                    stroke-dashoffset: 40;
                    animation: ecgDraw 1.2s linear infinite;
                  }
                  @keyframes ecgDraw {
                    0% { stroke-dashoffset: 40; opacity: 1; transform: translateX(-10px); }
                    80% { stroke-dashoffset: 0; opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; transform: translateX(10px); }
                  }
                  @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                  }
                `}</style>
                    </div>
                );
            default:
                return null;
        }
    };

    const hasAnimation = id === 'waves' || id === 'projectile_motion' || id === 'human_heart';

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="relative aspect-[16/9] bg-[#1a1a1a]">
                {hasAnimation ? (
                    <>
                        <div className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {renderVisual()}
                        </div>
                    </>
                ) : (
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                )}
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
