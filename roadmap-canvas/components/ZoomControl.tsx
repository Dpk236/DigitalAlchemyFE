
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({ zoom, onZoomChange }) => {
  const handleIncrease = () => onZoomChange(Math.min(150, zoom + 5));
  const handleDecrease = () => onZoomChange(Math.max(50, zoom - 5));

  // Range is 50 to 150, span is 100.
  const percentage = ((zoom - 50) / 100) * 100;

  return (
    <div className="fixed bottom-28 md:bottom-12 left-6 z-50 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="bg-white border-[3px] border-black p-2 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2 relative">
        <button 
          onClick={handleIncrease}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Zoom In"
        >
          <ZoomIn size={20} />
        </button>

        <div className="h-32 w-8 relative flex justify-center items-center py-2">
           {/* Custom Vertical Track */}
           <div className="absolute h-[90%] w-2 bg-gray-100 rounded-full border-2 border-black/10 overflow-hidden">
              <div 
                className="absolute bottom-0 w-full bg-[#4A86E8] transition-all duration-200"
                style={{ height: `${percentage}%` }}
              />
           </div>
           
           {/* Input Range on top, invisible but interactive */}
           <input
             type="range"
             min="50"
             max="150"
             step="5"
             value={zoom}
             onChange={(e) => onZoomChange(Number(e.target.value))}
             className="absolute w-32 h-8 opacity-0 cursor-pointer origin-center -rotate-90 z-20"
             style={{ touchAction: 'none' }}
           />
           
           {/* Visual Thumb */}
           <div 
             className="absolute w-4 h-4 bg-yellow-400 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] pointer-events-none transition-all duration-200 z-10"
             style={{ bottom: `calc(${percentage}% - 8px)` }}
           />
        </div>

        <button 
          onClick={handleDecrease}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>

        {/* Connector line decoration */}
        <div className="absolute top-1/2 -right-3 w-3 h-[2px] bg-black"></div>
      </div>
      
      <div className="bg-black text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] border-2 border-transparent">
        {zoom}%
      </div>
    </div>
  );
};
