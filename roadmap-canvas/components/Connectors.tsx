
import React from 'react';

export const VerticalLine: React.FC = () => (
  <div className="flex flex-col items-center py-4">
    <div className="h-24 w-2 bg-black relative rounded-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-yellow-400 border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-5 h-5 rounded-full bg-yellow-400 border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
    </div>
  </div>
);

interface HorizontalConnectorProps {
  side: 'left' | 'right';
}

export const HorizontalConnector: React.FC<HorizontalConnectorProps> = ({ side }) => {
  return (
    <div 
      className={`hidden md:block absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none ${
        side === 'left' ? 'left-full' : 'right-full'
      }`}
      style={{ width: '110px' }} 
    >
      <svg width="100%" height="60" viewBox="0 0 110 60" className="overflow-visible">
        <path 
          d={side === 'left' 
            ? "M 110 30 Q 55 30, 0 30" 
            : "M 0 30 Q 55 30, 110 30"
          }
          fill="none"
          stroke="black"
          strokeWidth="4"
          strokeDasharray="8, 8"
          strokeLinecap="round"
        />
        {/* Terminal dots */}
        <circle cx={side === 'left' ? '5' : '105'} cy="30" r="6" fill="black" />
        <circle cx={side === 'left' ? '105' : '5'} cy="30" r="7" fill="#4A86E8" stroke="black" strokeWidth="3" />
      </svg>
    </div>
  );
};
