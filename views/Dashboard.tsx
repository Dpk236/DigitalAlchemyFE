import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/Dashboard/VideoCard';
import SubjectFilters from '../components/Dashboard/SubjectFilters';
import VideosSubjects from '../mock-data/videos-subject.json';
const CDN_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState('PHYSICS');
  const [videosSubjects] = useState(VideosSubjects);
  const getThumbnail = (subject: string) => {
    switch (subject.toUpperCase()) {
      case 'PHYSICS': return `${CDN_BASE_URL}Media/Video/hackathon/waves/waves-thumbnail.png`;
      case 'CHEMISTRY': return "https://images.pexels.com/photos/15509860/pexels-photo-15509860.jpeg";
      case 'MATHEMATICS': return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600";
      case 'BIOLOGY': return `${CDN_BASE_URL}Media/Video/hackathon/human-heart/human-heart-thumbnail.png`;
      default: return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600";
    }
  };

  const lectures = videosSubjects.map((video) => ({
    id: video.assetId.toString(),
    title: video.title,
    subject: video.subject.toUpperCase(),
    topic: "GENERAL",
    date: "Feb 05, 2026",
    time: "10:00 AM",
    thumbnail: getThumbnail(video.subject),
    path: video.path
  }));



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
