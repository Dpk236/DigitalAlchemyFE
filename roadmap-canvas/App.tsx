
import React, { useState, useEffect, useMemo } from 'react';
import { PHYSICS_ROADMAP, DEFAULT_COMPLETED_PHYSICS } from './constants';
import { MainNode } from './components/MainNode';
import { BranchBox } from './components/BranchBox';
import { VerticalLine, HorizontalConnector } from './components/Connectors';
import { ProgressBar } from './components/ProgressBar';
import { ZoomControl } from './components/ZoomControl';
import { 
  GraduationCap, 
  ArrowDown, 
  Atom, 
  Sparkles, 
  Telescope, 
  Wind, 
  Zap, 
  Activity,
  Lightbulb
} from 'lucide-react';

const getIconForSection = (id: string) => {
  switch (id) {
    case 'intro': return <Lightbulb className="text-yellow-400" />;
    case 'mechanics-1': return <Telescope className="text-blue-400" />;
    case 'mechanics-2': return <Zap className="text-orange-400" />;
    case 'energy': return <Activity className="text-green-400" />;
    case 'waves': return <Wind className="text-purple-400" />;
    default: return <Atom className="text-blue-400" />;
  }
};

const App: React.FC = () => {
  // State for completed items, initialized from localStorage or defaults
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    try {
      // Changed key to v3 to force refresh with correct defaults
      const saved = localStorage.getItem('physics-roadmap-progress-v3');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
      return new Set(DEFAULT_COMPLETED_PHYSICS);
    } catch (e) {
      return new Set(DEFAULT_COMPLETED_PHYSICS);
    }
  });

  // State for currently reading topic
  const [currentTopic, setCurrentTopic] = useState<string | null>(() => {
    try {
      return localStorage.getItem('physics-roadmap-current');
    } catch (e) {
      return null;
    }
  });

  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Persist to localStorage whenever completedItems changes
  useEffect(() => {
    localStorage.setItem('physics-roadmap-progress-v3', JSON.stringify([...completedItems]));
  }, [completedItems]);

  // Persist current topic
  useEffect(() => {
    if (currentTopic) {
      localStorage.setItem('physics-roadmap-current', currentTopic);
    } else {
      localStorage.removeItem('physics-roadmap-current');
    }
  }, [currentTopic]);

  const toggleItem = (id: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      // If we complete the current topic, clear the current topic marker
      if (currentTopic === id) {
        setCurrentTopic(null);
      }
    }
    setCompletedItems(newSet);
  };

  // Calculate total items for progress bar
  const totalTopics = useMemo(() => {
    return PHYSICS_ROADMAP.reduce((acc, section) => {
      const leftCount = section.leftBranches?.reduce((lAcc, b) => lAcc + b.items.length, 0) || 0;
      const rightCount = section.rightBranches?.reduce((rAcc, b) => rAcc + b.items.length, 0) || 0;
      return acc + leftCount + rightCount;
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-blue-200 font-sans text-black overflow-x-hidden">
      {/* Background Decorative Element - Paper Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '60px 60px' }}>
      </div>

      {/* Main Content Wrapper for Zooming */}
      <div 
        style={{ 
          transform: `scale(${zoomLevel / 100})`, 
          transformOrigin: 'top center',
          width: '100%',
        }}
        className="transition-transform duration-200 ease-out py-20 px-6 pb-32"
      >
        {/* Header Section */}
        <header className="max-w-6xl mx-auto text-center mb-40 relative z-10">
          <div className="inline-flex items-center gap-3 bg-white border-[3px] border-black text-black px-10 py-3 rounded-full mb-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <Sparkles size={24} className="text-blue-500 fill-blue-500" />
            <span className="text-sm font-black uppercase tracking-[0.4em]">Mastering the Universe</span>
          </div>
          
          <h1 className="text-8xl md:text-[11rem] font-black mb-10 tracking-tighter text-black leading-none drop-shadow-[12px_12px_0px_rgba(74,134,232,0.2)]">
            PHYSICS <span className="text-[#4A86E8] italic">11</span>
          </h1>
          
          <div className="flex items-center justify-center gap-10 mb-12">
            <div className="h-[4px] w-32 bg-black rounded-full"></div>
            <div className="w-10 h-10 bg-yellow-400 border-[4px] border-black rounded-2xl rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Atom size={24} />
            </div>
            <div className="h-[4px] w-32 bg-black rounded-full"></div>
          </div>
          
          <p className="text-3xl text-gray-600 max-w-3xl mx-auto font-black leading-tight uppercase tracking-tight font-handwriting">
            Your visual journey from basic measurements to the complexity of thermodynamics.
          </p>
        </header>

        {/* Roadmap Container */}
        <div className="max-w-7xl mx-auto flex flex-col items-center relative">
          {/* Central Spine */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 bg-black/10 -z-0 rounded-full hidden md:block" />

          {PHYSICS_ROADMAP.map((section, index) => (
            <React.Fragment key={section.id}>
              {/* Section Row */}
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-16 md:gap-[110px] relative py-16 z-10">
                
                {/* Left Side Subtopics */}
                <div className="w-full md:w-[42%] flex flex-col items-center md:items-end order-2 md:order-1 px-4">
                  {section.leftBranches?.map((branch, bIdx) => (
                    <div key={bIdx} className="relative w-full flex justify-center md:justify-end items-center">
                      <BranchBox 
                        subTopic={branch} 
                        sectionId={section.id}
                        completedItems={completedItems}
                        onToggle={toggleItem}
                        currentTopic={currentTopic}
                        onSetCurrent={setCurrentTopic}
                      />
                      <HorizontalConnector side="left" />
                    </div>
                  ))}
                </div>

                {/* Center Milestone */}
                <div className="w-full md:w-fit flex flex-col items-center order-1 md:order-2 z-20 shrink-0">
                   <div className="mb-6 flex flex-col items-center">
                     <div className="w-16 h-16 bg-white border-[3px] border-black rounded-2xl rotate-[-6deg] flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                       {getIconForSection(section.id)}
                     </div>
                     {section.centerNote && (
                       <div className="bg-black text-white text-[11px] px-5 py-2 rounded-xl font-black mb-4 uppercase tracking-[0.3em] border-2 border-blue-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                         {section.centerNote}
                       </div>
                     )}
                   </div>
                   <MainNode title={section.mainTitle} description={section.description} />
                </div>

                {/* Right Side Subtopics */}
                <div className="w-full md:w-[42%] flex flex-col items-center md:items-start order-3 px-4">
                  {section.rightBranches?.map((branch, bIdx) => (
                    <div key={bIdx} className="relative w-full flex justify-center md:justify-start items-center">
                      <HorizontalConnector side="right" />
                      <BranchBox 
                        subTopic={branch} 
                        sectionId={section.id}
                        completedItems={completedItems}
                        onToggle={toggleItem}
                        currentTopic={currentTopic}
                        onSetCurrent={setCurrentTopic}
                      />
                    </div>
                  ))}
                </div>

              </div>

              {/* Vertical Segment Linker */}
              {index < PHYSICS_ROADMAP.length - 1 && (
                <div className="z-10 -my-8">
                  <VerticalLine />
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Completion Milestone */}
          <div className="mt-48 flex flex-col items-center mb-56 z-10">
            <div className="w-28 h-28 bg-white border-[6px] border-black rounded-full flex items-center justify-center text-black mb-14 animate-bounce shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <ArrowDown size={54} strokeWidth={4} />
            </div>
            
            <div className="bg-[#4A86E8] text-white border-[8px] border-black px-20 md:px-32 py-16 rounded-[5rem] shadow-[28px_28px_0px_0px_rgba(0,0,0,1)] text-center group cursor-pointer hover:scale-[1.04] transition-all relative overflow-hidden max-w-4xl">
              {/* Background pattern icon */}
              <Atom size={300} className="absolute -bottom-20 -right-20 opacity-10 rotate-45 text-white" />
              
              <GraduationCap size={110} className="mx-auto mb-10 text-yellow-300 drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]" />
              
              <h2 className="text-7xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                LEVEL UP<br/>COMPLETE
              </h2>
              
              <div className="h-3 w-48 bg-white/20 mx-auto mb-10 rounded-full border-2 border-black/10"></div>
              
              <p className="font-black text-black bg-yellow-400 inline-block px-10 py-4 rounded-3xl uppercase text-2xl tracking-[0.4em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[4px] border-black hover:bg-white transition-colors">
                CLASS 12 GOALS
              </p>
            </div>
          </div>
        </div>
        
        {/* Premium Footer - Inside Zoom Wrapper so it scales */}
        <footer className="bg-black text-white pt-40 pb-20 px-8 border-t-[16px] border-yellow-400 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h4 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">
              KEEP <span className="text-yellow-400">EXPLORING</span>
            </h4>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-20 items-center mt-20 border-t-2 border-white/10 pt-20">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-gray-500 font-black text-sm uppercase tracking-[0.5em] mb-4">The Academy</span>
                <p className="text-2xl font-black">PHYSICS HUB</p>
              </div>
              
              <div className="flex gap-12 font-black uppercase text-base tracking-widest">
                <a href="#" className="hover:text-yellow-400 transition-all underline decoration-yellow-400 decoration-4 underline-offset-8">Notes</a>
                <a href="#" className="hover:text-yellow-400 transition-all underline decoration-yellow-400 decoration-4 underline-offset-8">Labs</a>
                <a href="#" className="hover:text-yellow-400 transition-all underline decoration-yellow-400 decoration-4 underline-offset-8">Tests</a>
              </div>

              <div className="flex flex-col items-center lg:items-end">
                <div className="bg-yellow-400 text-black font-black px-6 py-2 text-sm uppercase rounded-xl border-[3px] border-white shadow-[4px_4px_0px_rgba(74,134,232,1)]">
                  v2.0 Premium
                </div>
                <p className="mt-4 text-gray-600 font-black text-xs uppercase tracking-tighter">© 2025 ALL RIGHTS RESERVED</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Fixed UI Elements - Outside Zoom Wrapper */}
      <ProgressBar completed={completedItems.size} total={totalTopics} />
      <ZoomControl zoom={zoomLevel} onZoomChange={setZoomLevel} />

      <style>{`
        body {
          cursor: crosshair;
        }
      `}</style>
    </div>
  );
};

export default App;
