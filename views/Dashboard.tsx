import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import VideoCard from '../components/Dashboard/VideoCard';
import SubjectFilters from '../components/Dashboard/SubjectFilters';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState('CHEMISTRY');

  const lectures = [
    {
      id: "waves",
      title: "Introduction to Waves & Oscillations",
      subject: "PHYSICS",
      topic: "WAVES",
      date: "Feb 01, 2026",
      time: "10:00 AM",
      thumbnail: "https://images.unsplash.com/photo-1505672678657-cc7037095e60?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "projectile_motion",
      title: "Projectile Motion - Advanced Concepts",
      subject: "PHYSICS",
      topic: "MECHANICS",
      date: "Feb 01, 2026",
      time: "11:30 AM",
      thumbnail: "/projectile_motion_thumbnail.png",
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
      title: "Equilibrium Constants & Le Chatelier",
      subject: "CHEMISTRY",
      topic: "PHYSICAL",
      date: "Jan 24, 2026",
      time: "08:35 PM",
      thumbnail: "https://images.pexels.com/photos/9785607/pexels-photo-9785607.jpeg",
    },
    {
      title: "Coordination Compounds & Complexes",
      subject: "CHEMISTRY",
      topic: "INORGANIC",
      date: "Jan 20, 2026",
      time: "07:00 PM",
      thumbnail: "https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg",
    },
    {
      title: "Limits and Continuity - Foundations",
      subject: "MATHEMATICS",
      topic: "CALCULUS",
      date: "Jan 15, 2026",
      time: "10:00 AM",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
    }
  ];

  const groupedLectures = lectures.reduce((acc, lecture) => {
    const subject = lecture.subject;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(lecture);
    return acc;
  }, {} as Record<string, typeof lectures>);

  return (
    <div className="min-h-screen bg-gray-50/50 -m-8 p-12 animate-fade-in">
      {/* Dashboard Navigation */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">S</div>
              <div>
                <h2 className="text-sm font-black text-gray-900 leading-none">BatchSS2526</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Class Recordings & Content</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <SubjectFilters activeSubject={activeSubject} setActiveSubject={setActiveSubject} />

      <div className="space-y-16">
        {Object.entries(groupedLectures)
          .filter(([subject]) => subject === activeSubject)
          .map(([subject, subjectLectures]) => (
            <div key={subject}>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    {subject}
                    <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{subjectLectures.length} Lectures</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjectLectures.map((lecture) => (
                  <VideoCard
                    key={lecture.title}
                    {...lecture}
                    onPlay={() => navigate(`/video-lecture?video_id=${(lecture as any).id || 'waves'}`)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

export default Dashboard;
