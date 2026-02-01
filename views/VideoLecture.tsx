import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../types';
import VideoPlayer from '../components/VideoLecture/VideoPlayer';
import LectureInteractionPanel from '../components/VideoLecture/LectureInteractionPanel';
import heartBioData from '../mock-data/heart_bio.json';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoLecture: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoId = queryParams.get('video_id') || 'waves';

  const [leftTab, setLeftTab] = useState<'Chapters' | 'Transcripts'>('Transcripts');
  const [videoLanguage, setVideoLanguage] = useState<Language>('english');

  const chapters = [
    { time: "00:00", title: "Circulatory Pathways", desc: "Introduction to open and closed circulatory systems in the animal kingdom." },
    { time: "05:18", title: "Human Heart Structure", desc: "Detailed discussion on the anatomy of the human heart, chambers, and valves." },
    { time: "15:10", title: "Cardiac Cycle", desc: "Understanding the sequence of events in a single heartbeat." },
    { time: "22:45", title: "ECG Foundations", desc: "The basics of Electrocardiogram and what each wave represents." },
  ];

  const transcript = heartBioData.segments.map((segment: any) => ({
    time: formatTime(segment.start),
    startTime: segment.start,
    text: segment.text,
  }));



  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      {/* Left Pane: Video & Chapters/Transcript */}
      <VideoPlayer
        videoId={videoId}
        videoLanguage={videoLanguage}
        setVideoLanguage={setVideoLanguage}
        leftTab={leftTab}
        setLeftTab={setLeftTab}
        chapters={chapters}
        transcript={transcript}
      />

      {/* Right Pane: Interaction Panel */}
      <LectureInteractionPanel />

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes progress { 0% { width: 0; } 100% { width: 100%; } }
        .animate-progress { animation: progress 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default VideoLecture;
