
import React from 'react';
import { Play, FileText, Calendar, Clock, Atom, Heart } from 'lucide-react';

interface LectureCardProps {
  title: string;
  date: string;
  time: string;
  tags: string[];
  imageUrl: string;
  onClick?: () => void;
}

export const LectureCard: React.FC<LectureCardProps> = ({ title, date, time, tags, imageUrl, onClick }) => {
  
  const renderVisual = () => {
    switch (imageUrl) {
      case 'waves':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <svg viewBox="0 0 200 100" className="w-56 h-28 drop-shadow-[0_0_8px_rgba(38,99,235,0.8)] overflow-visible">
              {/* Primary Wave */}
              <path 
                d="M 0 50 Q 25 10 50 50 T 100 50 T 150 50 T 200 50"
                fill="none"
                stroke="#2663EB"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-wave-draw"
              />
              {/* Secondary Phase Shifted Wave */}
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
      case 'projectile':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
             <div className="relative w-56 h-32 border-b-2 border-white/20">
               {/* Grid Lines */}
               <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 100%' }}></div>
               
               {/* Trajectory */}
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
               
               {/* Target */}
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
               {/* Beating Heart Shape */}
               <Heart 
                 size={100} 
                 className="text-red-500 fill-red-500 animate-pulse-fast drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
                 strokeWidth={1.5}
               />
               {/* ECG Line Overlay */}
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
        return (
           <div className="relative">
              <Atom size={80} className="text-[#2663EB] animate-spin-slow opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play fill="white" className="text-white opacity-20" size={30} />
              </div>
              <style>{`
                .animate-spin-slow {
                  animation: spin 10s linear infinite;
                }
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
           </div>
        );
    }
  };

  return (
    <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_#2663EB] transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={onClick}>
      {/* Image / Thumbnail Section */}
      <div className="h-56 bg-[#1a1a1a] relative border-b-[3px] border-black overflow-hidden shrink-0">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        
        {/* Visual Content */}
        <div className="absolute inset-0 flex items-center justify-center">
             {renderVisual()}
        </div>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span 
              key={idx}
              className={`
                px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                ${idx === 0 ? 'bg-[#2663EB] text-white' : 'bg-[#FFFF00] text-black'}
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-black leading-tight mb-4 group-hover:text-[#2663EB] transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-6 mb-6 text-gray-500 font-bold text-xs uppercase tracking-wider mt-auto">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-black" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-black" />
            <span>{time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <button className="flex items-center gap-2 bg-white border-[3px] border-black px-5 py-2 rounded-xl shadow-[4px_4px_0px_0px_#2663EB] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group/btn">
            <div className="bg-[#2663EB] rounded-full p-1 text-white group-hover/btn:scale-110 transition-transform">
               <Play size={14} fill="currentColor" />
            </div>
            <span className="font-black text-sm text-[#2663EB] uppercase tracking-wide">Watch Now</span>
          </button>

          <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors" title="Download Notes">
            <FileText size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
