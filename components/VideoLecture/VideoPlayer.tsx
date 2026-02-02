
import React, { useState, useCallback } from 'react';
import { Language } from '../../types';
import VideoJS from './VideoJS';
import type Player from 'video.js/dist/types/player';
import TranscriptList from './TranscriptList';
import { updateSocketParams } from '../socket/socket';

interface VideoPlayerProps {
  videoId: string;
  videoLanguage: Language;
  setVideoLanguage: (lang: Language) => void;
  leftTab: 'Chapters' | 'Transcripts';
  setLeftTab: (tab: 'Chapters' | 'Transcripts') => void;
  chapters: any[];
  transcript: any[];
}

const CDN_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  videoLanguage,
  setVideoLanguage,
  leftTab,
  setLeftTab,
  chapters,
  transcript,
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const getFolder = (id: string) => id === 'projectile_motion' ? 'projectile' : 
                                   id === 'human_heart' ? 'human-heart' : id;
  const folderName = getFolder(videoId);
  const videoUrl = `${CDN_BASE_URL}Media/Video/hackathon/${folderName}/master.m3u8`;
  const vttUrl = `${CDN_BASE_URL}Media/Video/hackathon/${folderName}/${folderName.replace('-', '_')}_subtitle.vtt`;

  React.useEffect(() => {
    updateSocketParams(videoId);
  }, [videoId]);

  const handlePlayerReady = (playerInstance: any) => {
    setPlayer(playerInstance);

    playerInstance.on('play', () => setIsPlaying(true));
    playerInstance.on('pause', () => setIsPlaying(false));
    playerInstance.on('timeupdate', () => {
      setCurrentTime(playerInstance.currentTime() || 0);
    });
    playerInstance.on('volumechange', () => {
      setIsMuted(playerInstance.muted() || false);
    });
    playerInstance.on('ratechange', () => {
      setPlaybackRate(playerInstance.playbackRate() || 1);
    });

    // Audio Track Handling
    const updateAudioTracks = () => {
      const tracks = playerInstance.audioTracks();
      const trackList: any[] = [];
      // @ts-ignore
      for (let i = 0; i < tracks.length; i++) {
        // @ts-ignore
        trackList.push(tracks[i]);
      }
      setAudioTracks(trackList);
    };

    playerInstance.on('loadedmetadata', updateAudioTracks);
    // Also listen to audio track list changes if tracks are added dynamically
    playerInstance.audioTracks().on('addtrack', updateAudioTracks);
    playerInstance.audioTracks().on('removetrack', updateAudioTracks);
    playerInstance.audioTracks().on('change', () => {
       // Force re-render to update UI when track changes
       updateAudioTracks();
    });

  };

  const switchAudioTrack = (index: number) => {
    if (!player) return;
    const tracks = player.audioTracks();
    // @ts-ignore
    for (let i = 0; i < tracks.length; i++) {
        // @ts-ignore
        tracks[i].enabled = (i === index);
    }
    // Update local state is automatic via event listener above, but we can close menu
    setIsLanguageMenuOpen(false);
  };

  // Helper to map track info to friendly names
  const getTrackName = (track: any, index: number) => {
    // If track has a language code, try to map it
    const lang = track.language || '';
    const label = track.label || '';

    if (lang === 'eng' || label.toLowerCase().includes('english')) return 'English';
    if (lang === 'hin' || label.toLowerCase().includes('hindi')) return 'Hindi (हिन्दी)';
    if (lang === 'mar' || label.toLowerCase().includes('marathi')) return 'Marathi (मराठी)';
    if (lang === 'tam' || label.toLowerCase().includes('tamil')) return 'Tamil (தமிழ்)';
    if (lang === 'tel' || label.toLowerCase().includes('telugu')) return 'Telugu (తెలుగు)';
    
    // Fallback for HLS stream labels (audio_1, audio_2, audio_3, etc.)
    if (label === 'audio_1' || (label === '' && index === 0)) return 'English';
    if (label === 'audio_2' || (label === '' && index === 1)) return 'Hindi (हिन्दी)';
    if (label === 'audio_3' || (label === '' && index === 2)) return 'Marathi (मराठी)';
    if (label === 'audio_4' || (label === '' && index === 3)) return 'Tamil (தமிழ்)';
    if (label === 'audio_5' || (label === '' && index === 4)) return 'Telugu (తెలుగు)';

    return label || `Audio ${index + 1}`;
  };

  const getActiveTrackLabel = () => {
     const activeIndex = audioTracks.findIndex(t => t.enabled);
     if (activeIndex !== -1) {
       return getTrackName(audioTracks[activeIndex], activeIndex);
     }
     if (audioTracks.length > 0) return getTrackName(audioTracks[0], 0);
     return 'Default';
  };

  const togglePlay = () => {
    if (!player) return;
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    const newMuted = !player.muted();
    player.muted(newMuted);
    setIsMuted(newMuted);
  };

  const togglePlaybackSpeed = () => {
    if (!player) return;
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    player.playbackRate(nextRate);
    setPlaybackRate(nextRate);
  };

  const toggleSubtitles = () => {
    if (!player) return;
    // @ts-ignore - Video.js types sometimes mismatch with browser types for TextTrackList
    const tracks = player.remoteTextTracks();
    const newState = !showSubtitles;
    for (let i = 0; i < (tracks as any).length; i++) {
      (tracks as any)[i].mode = newState ? 'showing' : 'disabled';
    }
    setShowSubtitles(newState);
  };

  const togglePiP = () => {
    if (!player) return;
    const video = player.el().querySelector('video');
    if (video) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        video.requestPictureInPicture();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !player.duration()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    player.currentTime(pos * player.duration());
  };

  const handleSeek = (timeStr: string) => {
    if (!player) return;
    const parts = timeStr.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    player.currentTime(seconds);
    player.play();
  };

  return (
    <div className="w-1/2.5 flex flex-col border-r border-gray-100 overflow-auto scrollbar-hide">
      <div className="p-8 max-w-2xl mx-auto w-full">
        <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group mb-8">
          <VideoJS
            videoUrl={videoUrl}
            vttUrl={vttUrl}
            onReady={handlePlayerReady}
          />

          {/* Centered Classic Play Button */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 cursor-pointer group/overlay"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover/overlay:scale-110 group-hover/overlay:bg-blue-500">
                <svg className="w-8 h-8 translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 5.5V18.5L19 12L7 5.5Z" />
                </svg>
              </div>
            </div>
          )}

          {/* Bottom Left Language Pill */}
          <div className="absolute bottom-16 left-4 z-20">
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="bg-black/30 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 border border-white/10 hover:bg-black/40 transition-all shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{getActiveTrackLabel()}</span>
                <svg className={`w-3 h-3 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-44 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                  {audioTracks.length > 0 ? (
                    audioTracks.map((track, index) => (
                      <button
                        key={index}
                        onClick={() => switchAudioTrack(index)}
                        className={`w-full text-left px-4 py-3 text-[11px] font-bold transition-colors border-b border-white/5 last:border-0 ${track.enabled ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'
                          }`}
                      >
                        {getTrackName(track, index)}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[11px] text-white/50">No Alternate Audio</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Custom Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/40 backdrop-blur-xl flex items-center px-4 gap-4 z-20 text-white/80">
            <button onClick={togglePlay} className="hover:text-white transition-colors">
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              )}
            </button>

            <button onClick={toggleMute} className="flex items-center gap-2 group/vol hover:text-white transition-colors">
              {isMuted ? (
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            <div className="text-[11px] font-medium tracking-tight w-24 tabular-nums">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {player?.duration() ? `${Math.floor(player.duration() / 60)}:${Math.floor(player.duration() % 60).toString().padStart(2, '0')}` : '0:00'}
            </div>

            <div
              className="flex-1 h-1 bg-white/20 rounded-full relative group/seek cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / (player?.duration() || 1)) * 100}%` }}
              ></div>
              {/* Hover Thumb */}
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/seek:scale-100 transition-transform duration-200"
                style={{ left: `${(currentTime / (player?.duration() || 1)) * 100}%`, marginLeft: '-6px' }}
              ></div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={togglePlaybackSpeed}
                className="text-[11px] font-black uppercase hover:text-white transition-colors tracking-widest w-6"
              >
                {playbackRate}x
              </button>
              <button
                onClick={toggleSubtitles}
                className={`hover:text-white transition-colors ${showSubtitles ? 'text-blue-400' : 'text-white/40'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </button>
              <button onClick={togglePiP} className="hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="hover:text-white transition-colors" onClick={() => player?.requestFullscreen()}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          {/* <button
            onClick={() => setLeftTab('Chapters')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${leftTab === 'Chapters' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${leftTab === 'Chapters' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            Chapters
          </button> */}
          <button
            onClick={() => setLeftTab('Transcripts')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${leftTab === 'Transcripts' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${leftTab === 'Transcripts' ? 'bg-blue-500' : 'bg-transparent opacity-0'}`}></div>
            Transcripts
          </button>
          <div className="ml-auto flex gap-2">
            <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync
            </button>
          </div>
        </div>

        <div className="animate-fade-in">
          {/* {leftTab === 'Chapters' ? (
            <div className="mt-8 space-y-6">
              {chapters.map((chap, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => handleSeek(chap.time)}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">{chap.time}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{chap.title}</h4>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{chap.desc}</p>
                </div>
              ))}
            </div>
          ) : ( */}
          <TranscriptList
            transcript={transcript}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
