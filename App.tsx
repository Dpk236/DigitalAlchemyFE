
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { AppView } from './types';
import Dashboard from './views/Dashboard';
import VideoLecture from './views/VideoLecture';
import StudyMaterial from './views/StudyMaterial';
import PracticeZone from './views/PracticeZone';
import RevisionHub from './views/RevisionHub';

import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  const isVideo = location.pathname === '/video-lecture';

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <main className="flex-1 overflow-auto relative">
        {!isDashboard && (
          <header className="sticky top-0 z-20 bg-white border-b px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a4 4 0 01-2.574.344l-3.147-.63a2 2 0 01-1.583-1.798V5.083a2 2 0 011.583-1.798l3.147-.63a4 4 0 012.574.344l.675.337a6 6 0 003.86.517l2.387-.477a2 2 0 011.022.547l3.561 3.561a2 2 0 010 2.828l-3.561 3.561z" />
                  </svg>
                </div>
                <h1 className="text-sm font-black text-gray-900 tracking-tight uppercase">
                  {isVideo ? "Digital Alchemy" : location.pathname.split('/')[1]?.replace('-', ' ') || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-sm font-bold border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-black shadow-sm transition-all">
                <span className="text-indigo-600 font-black">+</span> Create Exam
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 border overflow-hidden">
                <img src="https://picsum.photos/32/32?seed=user" alt="Profile" />
              </div>
            </div>
          </header>
        )}

        <div className={isVideo ? "h-[calc(100vh-57px)]" : isDashboard ? "p-0" : "p-8"}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video-lecture" element={<VideoLecture />} />
            <Route path="/study-material" element={<StudyMaterial onAskAI={() => { }} />} />
            <Route path="/practice" element={<PracticeZone onAskAI={() => { }} />} />
            <Route path="/revision" element={<RevisionHub />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #ccc; }
      `}</style>
    </div>
  );
};

export default App;
