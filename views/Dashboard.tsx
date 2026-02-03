import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectRoadmap from '../components/Roadmap/SubjectRoadmap';
import VideoCard from '../components/Dashboard/VideoCard';

const CDN_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState('PHYSICS');
  const [activeView, setActiveView] = useState<'Lectures' | 'Roadmap'>('Lectures');

  const subjects = [
    { id: 'PHYSICS', label: 'Physics', icon: 'science' },
    { id: 'CHEMISTRY', label: 'Chemistry', icon: 'vaping_rooms' },
    { id: 'BIOLOGY', label: 'Biology', icon: 'biotech' },
    { id: 'MATHEMATICS', label: 'Mathematics', icon: 'functions' },
  ];

  const views: Array<'Lectures' | 'Roadmap'> = ['Lectures', 'Roadmap'];

  const learningPaths: Record<string, string[]> = {
    PHYSICS: ['CLASS 11', 'CLASS 12', 'JEE PREP', 'NEET PREP', 'CRASH COURSE'],
    CHEMISTRY: ['CLASS 11', 'CLASS 12', 'JEE PREP', 'NEET PREP'],
    BIOLOGY: ['CLASS 11', 'CLASS 12', 'NEET PREP'],
    MATHEMATICS: ['CLASS 11', 'CLASS 12', 'JEE PREP', 'OLYMPIAD'],
  };

  const lectures = [
    {
      id: "waves",
      title: "Introduction to Waves & Oscillations",
      subject: "PHYSICS",
      topic: "WAVES",
      date: "Feb 01, 2026",
      time: "10:00 AM",
      thumbnail: `${CDN_BASE_URL}Media/Video/hackathon/waves/waves-thumbnail.png`,
    },
    {
      id: "projectile_motion",
      title: "Projectile Motion - Advanced Concepts",
      subject: "PHYSICS",
      topic: "MECHANICS",
      date: "Feb 01, 2026",
      time: "11:30 AM",
      thumbnail: `${CDN_BASE_URL}Media/Video/hackathon/projectile/projectile-motion-thumbnail.png`,
    },
    {
      title: "Chemical Kinetics & Reaction Mechanisms",
      subject: "CHEMISTRY",
      topic: "ORGANIC",
      date: "Jan 29, 2026",
      time: "08:35 PM",
      thumbnail: "https://images.pexels.com/photos/15509860/pexels-photo-15509860.jpeg",
    },
    {
      title: "Limits and Continuity - Foundations",
      subject: "MATHEMATICS",
      topic: "CALCULUS",
      date: "Jan 15, 2026",
      time: "10:00 AM",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "human_heart",
      title: "Human Heart - Anatomy and Physiology",
      subject: "BIOLOGY",
      topic: "HUMAN PHYSIOLOGY",
      date: "Feb 02, 2026",
      time: "15:22 PM",
      thumbnail: `${CDN_BASE_URL}Media/Video/hackathon/human-heart/human-heart-thumbnail.png`,
    }
  ];

  const filteredLectures = lectures.filter(lecture => lecture.subject === activeSubject);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">S</div>
            <h1 className="font-bold text-base leading-tight">Digital Alchemy</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg font-medium text-xs hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-sm">account_circle</span>
              Student Profile
            </button>
          </div>
        </div>

        {/* Primary Nav (Subjects) */}
        <nav className="bg-white border-t border-slate-100">
          <div className="max-w-[1600px] mx-auto px-6 flex items-center gap-8 overflow-x-auto no-scrollbar">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject.id)}
                className={`py-4 text-sm tracking-widest uppercase flex items-center gap-2 shrink-0 transition-all border-b-2 ${
                  activeSubject === subject.id 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-blue-600'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{subject.icon}</span>
                {subject.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Secondary Nav (Lectures / Roadmap) */}
        <nav className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {views.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all shrink-0 ${
                  activeView === view
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">
        {activeView === 'Lectures' ? (
          // Lectures View
          <div className="min-h-screen bg-gray-50/50 p-12 animate-fade-in">
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    {activeSubject}
                    <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                      {filteredLectures.length} Lectures
                    </span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLectures.map((lecture) => (
                  <VideoCard
                    key={lecture.title}
                    {...lecture}
                    onPlay={() => navigate(`/video-lecture?video_id=${(lecture as any).id || 'waves'}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Roadmap View
          <div className="roadmap-canvas-container">
            <SubjectRoadmap subject={activeSubject} />
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Isolate roadmap-canvas styling to preserve original fonts and styles */
        .roadmap-canvas-container {
          font-family: 'Inter', sans-serif;
        }
        .roadmap-canvas-container .font-handwriting {
          font-family: 'Balsamiq Sans', cursive;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
