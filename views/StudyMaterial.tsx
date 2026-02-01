
import React, { useState } from 'react';

interface StudyMaterialProps {
  onAskAI: (context: string) => void;
}

const StudyMaterial: React.FC<StudyMaterialProps> = ({ onAskAI }) => {
  const [selectedText, setSelectedText] = useState("");

  const handleSelection = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      setSelectedText(selection);
    }
  };

  const handleAskSelection = () => {
    if (selectedText) {
      onAskAI(`From PDF (Physics - Optics): "${selectedText}". Please explain this specifically in the context of refraction index.`);
      setSelectedText("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-800">Unit 3: Optics - Refraction.pdf</span>
            <span className="text-xs text-slate-500">Page 14 of 56</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className="p-2 hover:bg-slate-200 rounded text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>
        </div>

        <div className="p-12 flex-1 overflow-auto bg-slate-800 flex justify-center">
          <div 
            onMouseUp={handleSelection}
            className="w-full max-w-[800px] bg-white p-12 shadow-2xl relative select-text"
          >
            <div className="absolute top-0 right-0 p-8">
              <span className="text-slate-200 text-6xl font-bold italic select-none">14</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-8 text-blue-900 border-b-4 border-blue-600 inline-block pb-2">Refraction and Snell's Law</h2>
            
            <p className="text-lg leading-relaxed text-slate-700 mb-6">
              When light travels from one transparent medium to another, it usually changes its direction. This phenomenon is called <span className="font-bold text-blue-700">refraction of light</span>. The extent of refraction depends on the refractive indices of the two media.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-xl">
              <h4 className="font-bold text-blue-900 mb-2 uppercase text-xs tracking-widest">Key Concept: Snell's Law</h4>
              <p className="italic text-xl font-serif text-slate-800 text-center py-4">
                n₁ sin θ₁ = n₂ sin θ₂
              </p>
              <p className="text-sm text-slate-600">
                Where <span className="font-mono">n₁</span> and <span className="font-mono">n₂</span> are the refractive indices of the media, and <span className="font-mono">θ₁</span> and <span className="font-mono">θ₂</span> are the angles of incidence and refraction respectively.
              </p>
            </div>

            <p className="text-lg leading-relaxed text-slate-700 mb-6">
              Critical angle is the angle of incidence for which the angle of refraction is 90°. If the angle of incidence is greater than the critical angle, the phenomenon of <span className="underline decoration-wavy decoration-orange-400">Total Internal Reflection</span> (TIR) occurs. This is the basic principle behind optical fibers.
            </p>

            <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 italic">
              [Diagram Placeholder: Path of light ray through prism]
            </div>

            {/* Selection Popover */}
            {selectedText && (
              <div 
                className="fixed bg-white border border-slate-200 shadow-xl rounded-xl p-2 flex gap-2 animate-bounce-short z-20"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              >
                <button 
                  onClick={handleAskSelection}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
                >
                  <span>✨</span> Explain Selection
                </button>
                <button 
                  onClick={() => setSelectedText("")}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translate(-50%, -55%); }
          50% { transform: translate(-50%, -45%); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default StudyMaterial;
