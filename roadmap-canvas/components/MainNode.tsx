
import React from 'react';

interface MainNodeProps {
  title: string;
  description?: string;
}

export const MainNode: React.FC<MainNodeProps> = ({ title, description }) => {
  return (
    <div className="relative z-10 flex flex-col items-center animate-float">
      <div className="bg-[#FFFF00] border-[4px] border-black px-12 py-5 rounded-[2rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] min-w-[280px] text-center transform hover:scale-105 transition-all relative overflow-hidden group">
        {/* Subtle inner gloss effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 -skew-y-6 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        
        <h3 className="font-black text-2xl text-black uppercase tracking-tighter leading-none mb-1">
          {title}
        </h3>
        {description && (
          <div className="mt-3 pt-2 border-t-[3px] border-black/5">
            <p className="text-[12px] font-black text-black/60 uppercase tracking-[0.2em]">
              {description}
            </p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
