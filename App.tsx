
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { AppView } from './types';
import Dashboard from './views/Dashboard';
import VideoLecture from './views/VideoLecture';
import StudyMaterial from './views/StudyMaterial';
import PracticeZone from './views/PracticeZone';
import RevisionHub from './views/RevisionHub';

import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import Header from './components/Common/Header';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  const isVideo = location.pathname === '/video-lecture';

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <main className="flex-1 overflow-auto relative">
        <Header />

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
