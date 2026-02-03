
import React, { useState } from 'react';
import { SubTopic } from '../types';
import { ChevronRight, Bookmark, Check, Play, FileText, X, Eye, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BranchBoxProps {
  subTopic: SubTopic;
  sectionId: string;
  completedItems: Set<string>;
  onToggle: (id: string) => void;
  currentTopic: string | null;
  onSetCurrent: (id: string | null) => void;
}

export const BranchBox: React.FC<BranchBoxProps> = ({ 
  subTopic, 
  sectionId, 
  completedItems, 
  onToggle,
  currentTopic,
  onSetCurrent
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const getUniqueId = (itemId: string) => `${sectionId}-${itemId}`;

  return (
    <div className="bg-white border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[280px] w-full md:w-[320px] mb-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(74,134,232,1)] transition-all z-10 group cursor-default">
      <div className="bg-[#FFD966] border-b-[3px] border-black py-4 px-5 flex items-center justify-between">
        <span className="font-black text-[15px] text-black uppercase tracking-wider">
          {subTopic.title}
        </span>
        <Bookmark size={18} className="text-black/30 group-hover:text-black transition-colors" />
      </div>
      <div className="p-4 space-y-3 bg-white">
        {subTopic.items.map((item, idx) => {
          const uniqueId = getUniqueId(item.id);
          const isCompleted = completedItems.has(uniqueId);
          const isExpanded = expandedItem === uniqueId;
          const isReading = currentTopic === uniqueId;

          return (
            <div key={idx} className="relative">
              {/* Main Item Row */}
              <div 
                className={`
                  relative border-2 rounded-xl py-2 px-3 flex items-center gap-3 transition-all
                  ${isCompleted 
                    ? 'bg-green-50 border-green-500' 
                    : isReading
                      ? 'bg-yellow-50 border-yellow-400 shadow-[0_0_0_2px_rgba(250,204,21,0.3)]'
                      : isExpanded 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'bg-[#F8FAFC] border-black/10 hover:border-black'
                  }
                `}
              >
                {/* Reading Indicator (Left Edge) */}
                {isReading && !isCompleted && (
                   <div className="absolute -left-[2px] top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-400 rounded-r-md animate-pulse" />
                )}

                {/* Checkbox Area */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(uniqueId);
                  }}
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 shadow-none' 
                      : 'bg-white border-black/20 hover:border-black hover:bg-gray-50'
                    }
                  `}
                >
                  {isCompleted && <Check size={14} className="text-white stroke-[4]" />}
                </button>

                {/* Content Area - Click to Expand */}
                <div 
                  className="flex-1 cursor-pointer flex items-center justify-between group/text overflow-hidden"
                  onClick={() => setExpandedItem(isExpanded ? null : uniqueId)}
                >
                  <div className="flex flex-col min-w-0">
                    <span className={`font-handwriting text-base font-bold leading-tight select-none truncate ${isCompleted ? 'text-green-800 line-through opacity-60' : 'text-gray-800'}`}>
                      {item.title}
                    </span>
                    {isReading && !isCompleted && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <BookOpen size={10} className="text-yellow-600" />
                        <span className="text-[9px] font-black text-yellow-600 uppercase tracking-wider animate-pulse">Currently Reading</span>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform duration-300 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-90 text-blue-600' : 'text-gray-300 group-hover/text:text-black'}`} 
                  />
                </div>
              </div>

              {/* Expanded Resource Panel */}
              {isExpanded && (
                <div className="mt-2 ml-4 pl-4 border-l-[3px] border-dashed border-blue-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-blue-50 border-[2px] border-blue-200 rounded-xl p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Learning Materials</span>
                      <button onClick={() => setExpandedItem(null)}>
                        <X size={14} className="text-blue-400 hover:text-blue-600" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Reading Status Toggle */}
                      {!isCompleted && (
                        <button 
                          onClick={() => onSetCurrent(isReading ? null : uniqueId)}
                          className={`
                            w-full flex items-center gap-2 border-2 px-3 py-2 rounded-lg transition-all group/btn
                            ${isReading 
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-700' 
                              : 'bg-white border-blue-100 hover:border-blue-500 hover:shadow-md'
                            }
                          `}
                        >
                          <div className={`p-1 rounded-md ${isReading ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isReading ? <BookOpen size={14} /> : <Eye size={14} />}
                          </div>
                          <span className="text-xs font-bold group-hover/btn:text-black">
                            {isReading ? 'Stop Reading' : 'Mark as Currently Reading'}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/video-lecture?video_id=${item.id}`)}
                        className="w-full flex items-center gap-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:shadow-md px-3 py-2 rounded-lg transition-all group/btn"
                      >
                        <div className="bg-red-100 text-red-500 p-1 rounded-md">
                          <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs font-bold text-gray-700 group-hover/btn:text-black">Watch Lecture</span>
                      </button>
                      
                      <button
                        onClick={() => navigate(`/learn/${item.title.toLowerCase().replace(/\s+/g, '-')}/notes`)}
                        className="w-full flex items-center gap-2 bg-white border-2 border-blue-100 hover:border-blue-500 hover:shadow-md px-3 py-2 rounded-lg transition-all group/btn"
                      >
                        <div className="bg-orange-100 text-orange-500 p-1 rounded-md">
                          <FileText size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 group-hover/btn:text-black">Read Notes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
