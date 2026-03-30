
import React from 'react';
import { Trophy } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100) || 0;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 md:pb-6 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center gap-4 pointer-events-auto transform transition-transform hover:-translate-y-1">
        
        <div className="bg-yellow-400 border-[3px] border-black p-2 rounded-xl shrink-0">
          <Trophy size={24} className="text-black" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-end mb-2">
            <span className="font-black text-xs uppercase tracking-[0.2em]">Overall Progress</span>
            <span className="font-black text-sm">{percentage}%</span>
          </div>
          
          <div className="w-full h-4 bg-gray-100 border-[2px] border-black rounded-full overflow-hidden relative">
            {/* Striped Background Pattern */}
            <div 
              className="absolute inset-0 bg-[#4A86E8] transition-all duration-500 ease-out flex items-center"
              style={{ width: `${percentage}%` }}
            >
              <div className="w-full h-full opacity-20" 
                   style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} 
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <div className="font-handwriting text-sm font-bold text-gray-500">
            {completed} / {total} Topics
          </div>
        </div>
      </div>
    </div>
  );
};
