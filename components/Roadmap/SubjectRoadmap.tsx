
import React, { useState, useEffect, useMemo } from 'react';
import { ROADMAPS } from '../../constants/roadmaps';
import { DEFAULT_COMPLETED_PHYSICS } from '../../roadmap-canvas/constants';
import { MainNode } from '../../roadmap-canvas/components/MainNode';
import { BranchBox } from '../../roadmap-canvas/components/BranchBox';
import { VerticalLine, HorizontalConnector } from '../../roadmap-canvas/components/Connectors';
import { ProgressBar } from '../../roadmap-canvas/components/ProgressBar';
import { ZoomControl } from '../../roadmap-canvas/components/ZoomControl';
import { 
  GraduationCap, 
  ArrowDown, 
  Atom, 
  Sparkles, 
  Telescope, 
  Wind, 
  Zap, 
  Activity,
  Lightbulb,
  FlaskConical,
  Dna,
  Calculator,
  Microscope,
  Flame,
  Droplets,
  FunctionSquare
} from 'lucide-react';

interface SubjectRoadmapProps {
  subject: string;
}

const getIconForSection = (id: string, subject: string) => {
  // Generic mapping based on keywords or subject
  if (subject === 'CHEMISTRY') {
     if (id.includes('atomic')) return <Atom className="text-blue-400" />;
     if (id.includes('bonding')) return <FlaskConical className="text-purple-400" />;
     if (id.includes('thermo')) return <Flame className="text-orange-400" />;
     if (id.includes('eq')) return <Activity className="text-green-400" />;
     if (id.includes('matter')) return <Droplets className="text-blue-500" />;
     return <FlaskConical className="text-blue-400" />;
  }
  if (subject === 'BIOLOGY') {
    if (id.includes('cell')) return <Microscope className="text-pink-400" />;
    if (id.includes('plant')) return <Sparkles className="text-green-500" />;
    if (id.includes('human')) return <Activity className="text-red-400" />;
    return <Dna className="text-green-400" />;
  }
  if (subject === 'MATHEMATICS') {
    if (id.includes('calc')) return <FunctionSquare className="text-orange-400" />;
    if (id.includes('geo')) return <Wind className="text-purple-400" />;
    return <Calculator className="text-blue-400" />;
  }

  // Fallback / Physics defaults
  switch (id) {
    case 'intro': return <Lightbulb className="text-yellow-400" />;
    case 'mechanics-1': return <Telescope className="text-blue-400" />;
    case 'mechanics-2': return <Zap className="text-orange-400" />;
    case 'energy': return <Activity className="text-green-400" />;
    case 'waves': return <Wind className="text-purple-400" />;
    default: return <Atom className="text-blue-400" />;
  }
};

const getSubjectTitle = (subject: string) => {
  switch (subject) {
    case 'PHYSICS': return { title: 'PHYSICS', color: 'text-[#4A86E8]', icon: <Atom size={24} /> };
    case 'CHEMISTRY': return { title: 'CHEMISTRY', color: 'text-purple-500', icon: <FlaskConical size={24} /> };
    case 'BIOLOGY': return { title: 'BIOLOGY', color: 'text-green-500', icon: <Dna size={24} /> };
    case 'MATHEMATICS': return { title: 'MATHS', color: 'text-orange-500', icon: <Calculator size={24} /> };
    default: return { title: 'COURSE', color: 'text-blue-500', icon: <Atom size={24} /> };
  }
};

const SubjectRoadmap: React.FC<SubjectRoadmapProps> = ({ subject }) => {
  const currentRoadmap = ROADMAPS[subject as keyof typeof ROADMAPS] || ROADMAPS.PHYSICS;
  // Use v3 keys to to ensure refresh with new ID structure
  const storageKey = `${subject.toLowerCase()}-roadmap-progress-v3`;
  const currentTopicKey = `${subject.toLowerCase()}-roadmap-current-v3`;

  // State for completed items
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
      // Apply defaults for PHYSICS
      if (subject === 'PHYSICS') {
        return new Set(DEFAULT_COMPLETED_PHYSICS);
      }
      return new Set(); 
    } catch (e) {
      if (subject === 'PHYSICS') {
        return new Set(DEFAULT_COMPLETED_PHYSICS);
      }
      return new Set();
    }
  });

  // State for currently reading topic
  const [currentTopic, setCurrentTopic] = useState<string | null>(() => {
    try {
      return localStorage.getItem(currentTopicKey);
    } catch (e) {
      return null;
    }
  });

  // State for zoom level
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Persist to localStorage whenever completedItems changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...completedItems]));
  }, [completedItems, storageKey]);

  // Persist current topic
  useEffect(() => {
    if (currentTopic) {
      localStorage.setItem(currentTopicKey, currentTopic);
    } else {
      localStorage.removeItem(currentTopicKey);
    }
  }, [currentTopic, currentTopicKey]);

  const toggleItem = (id: string) => {
    const newSet = new Set(completedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      if (currentTopic === id) {
        setCurrentTopic(null);
      }
    }
    setCompletedItems(newSet);
  };

  // Calculate total items
  const totalTopics = useMemo(() => {
    return currentRoadmap.reduce((acc, section) => {
      const leftCount = section.leftBranches?.reduce((lAcc, b) => lAcc + b.items.length, 0) || 0;
      const rightCount = section.rightBranches?.reduce((rAcc, b) => rAcc + b.items.length, 0) || 0;
      return acc + leftCount + rightCount;
    }, 0);
  }, [currentRoadmap]);

  const subjectInfo = getSubjectTitle(subject);

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-blue-200 font-sans text-black overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '60px 60px' }}>
      </div>

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
            {subjectInfo.title} <span className={`${subjectInfo.color} italic`}>11</span>
          </h1>
          
          <div className="flex items-center justify-center gap-10 mb-12">
            <div className="h-[4px] w-32 bg-black rounded-full"></div>
            <div className="w-10 h-10 bg-yellow-400 border-[4px] border-black rounded-2xl rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {subjectInfo.icon}
            </div>
            <div className="h-[4px] w-32 bg-black rounded-full"></div>
          </div>
          
          <p className="text-3xl text-gray-600 max-w-3xl mx-auto font-black leading-tight uppercase tracking-tight font-handwriting">
            Your visual journey through the concepts of {subject.toLowerCase()}.
          </p>
        </header>

        {/* Roadmap Container */}
        <div className="max-w-7xl mx-auto flex flex-col items-center relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 bg-black/10 -z-0 rounded-full hidden md:block" />

          {currentRoadmap.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-16 md:gap-[110px] relative py-16 z-10">
                
                {/* Left Side */}
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
                       {getIconForSection(section.id, subject)}
                     </div>
                     {section.centerNote && (
                       <div className="bg-black text-white text-[11px] px-5 py-2 rounded-xl font-black mb-4 uppercase tracking-[0.3em] border-2 border-blue-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                         {section.centerNote}
                       </div>
                     )}
                   </div>
                   <MainNode title={section.mainTitle} description={section.description} />
                </div>

                {/* Right Side */}
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

              {index < currentRoadmap.length - 1 && (
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
        
        <footer className="bg-black text-white pt-40 pb-20 px-8 border-t-[16px] border-yellow-400 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h4 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic">
              KEEP <span className="text-yellow-400">EXPLORING</span>
            </h4>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-20 items-center mt-20 border-t-2 border-white/10 pt-20">
              <div className="flex flex-col items-center lg:items-center">
                <p className="text-2xl font-black">AAKASH</p>
                <span className="text-gray-500 font-black text-sm uppercase tracking-[0.5em] mb-4">Medical | IIT-JEE  Foundation</span>

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

      <ProgressBar completed={completedItems.size} total={totalTopics} />
      <ZoomControl zoom={zoomLevel} onZoomChange={setZoomLevel} />
    </div>
  );
};

export default SubjectRoadmap;
