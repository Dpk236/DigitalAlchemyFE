
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/Dashboard/VideoCard';
import SubjectFilters from '../components/Dashboard/SubjectFilters';
import { STREAMS, STREAM_DATA, VIDEO_BASE_URL, THUMBNAIL_BASE_URL } from '../services/streamConstants';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStream, setActiveStream] = useState('SOE');
  const [activeSubject, setActiveSubject] = useState('');

  useEffect(() => {
    document.title = "Dashboard | Digital Alchemy";
  }, []);

  const currentStreamData = useMemo(() => STREAM_DATA[activeStream] || [], [activeStream]);


  const subjects = useMemo(() => {
    return currentStreamData.map((item: any) => ({
      id: item.subject.toUpperCase(),
      label: item.subject.charAt(0).toUpperCase() + item.subject.slice(1),
    }));
  }, [currentStreamData]);

  useEffect(() => {
    if (subjects.length > 0) {
      setActiveSubject(subjects[0].id);
    }
  }, [subjects]);


  const getThumbnail = (subject: string) => {
    switch (subject.toUpperCase()) {
      case 'PHYSICS': return `${THUMBNAIL_BASE_URL}Media/Video/hackathon/waves/waves-thumbnail.png`;
      case 'CHEMISTRY':
      case 'CHECMISTRY': return "https://images.pexels.com/photos/15509860/pexels-photo-15509860.jpeg";
      case 'MATHEMATICS': return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600";
      case 'BIOLOGY': return `https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600`;
      case 'BOTANY': return `https://images.unsplash.com/photo-1463171515643-952cee54d42a?auto=format&fit=crop&q=80&w=600`;
      case 'ZOOLOGY': return `https://images.unsplash.com/photo-1535443274868-756b0f070b6e?auto=format&fit=crop&q=80&w=600`;
      default: return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600";
    }
  };


  const lectures = useMemo(() => {
    const activeSubjectData = currentStreamData.find(
      (item: any) => item.subject.toUpperCase() === activeSubject
    );

    if (!activeSubjectData) return [];

    return activeSubjectData.syllabus_master_videos.map((video: any) => ({
      id: video.asset_id.toString(),
      title: video.asset_title,
      subject: activeSubjectData.subject.toUpperCase(),
      topic: video.topic || "GENERAL",
      date: "Feb 05, 2026",
      time: "10:00 AM",
      thumbnail: getThumbnail(activeSubjectData.subject),
      path: `${VIDEO_BASE_URL}${video.video_link}`
    }));
  }, [currentStreamData, activeSubject]);

  return (
    <div className="min-h-screen bg-gray-50/50 -m-8 p-12 animate-fade-in">
      {/* Dashboard Navigation */}
      <div className="flex items-center justify-between mb-8">
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


      {/* Stream Tabs */}
      <div className="flex items-center gap-2 mb-10 bg-white p-2 rounded-2xl border border-gray-100 w-fit shadow-sm">
        {STREAMS.map((stream) => (
          <button
            key={stream}
            onClick={() => setActiveStream(stream)}
            className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all duration-300 transform active:scale-95 ${activeStream === stream
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
              : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            {stream}
          </button>
        ))}
      </div>


      <SubjectFilters
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        subjects={subjects}
      />

      <div className="space-y-16">
        {activeSubject && (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  {activeSubject}
                  <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">{lectures.length} Lectures</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lectures.map((lecture) => (
                <VideoCard
                  key={lecture.id}
                  {...lecture}
                  onPlay={() => navigate(`/video-lecture?video_id=${lecture.id}&stream=${activeStream}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

