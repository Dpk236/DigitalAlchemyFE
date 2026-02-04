
import React, { useState, useEffect } from 'react';

interface SimulationProps {
  videoId: string;
}

const CDN_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";

const SIMULATION_INSTRUCTIONS: Record<string, string[]> = {
  PHYSICS: [
    "Adjust experiment variables like velocity, angle, or gravity using the sliders.",
    "Observe how real-time metrics change during the simulation.",
    "Hit 'Launch' to start the experiment and 'Reset' to try again.",
    "Drag your mouse to rotate the lab view and scroll to zoom in/out.",
    "Try to complete all designated missions in the experiment panel."
  ],
  BIOLOGY: [
    "Explore the interactive 3D model by rotating and zooming in.",
    "Click on specific anatomical structures to reveal detailed names and functions.",
    "Watch animations to understand physiological processes in real-time.",
    "Use the controls to isolate different systems or zoom into microscopic details.",
    "Interact with labels to deepen your understanding of biological mechanics."
  ],
  WAVES: [
    "Experiment with both Transverse and Longitudinal wave modes.",
    "Adjust frequency and amplitude to see how the wave pattern changes.",
    "Observe individual particles - they oscillate but don't travel with the wave!",
    "Identify compressions and rarefactions in the longitudinal simulation.",
    "Toggle 'Show Vectors' to visualize particle velocity and acceleration.",
    "Complete all designated missions in the experiment panel to master the concept."
  ],
  default: [
    "Interact with the 3D model using your mouse or touch.",
    "Use the control panel to adjust simulation parameters.",
    "Real-time data will update as you experiment.",
    "Toggle fullscreen for the best immersive experience."
  ]
};

const getInstructions = (videoId: string): string[] => {
  const biologyVideos = ['human_heart'];
  const wavesVideos = ['waves'];

  if (videoId === 'projectile_motion') return SIMULATION_INSTRUCTIONS.PHYSICS;
  if (wavesVideos.includes(videoId)) return SIMULATION_INSTRUCTIONS.WAVES;
  if (biologyVideos.includes(videoId)) return SIMULATION_INSTRUCTIONS.BIOLOGY;
  return SIMULATION_INSTRUCTIONS.default;
};

const Simulation: React.FC<SimulationProps> = ({ videoId }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset state when videoId changes
    setHasStarted(false);
    setIsFullscreen(false);
    setHtmlContent('');
    setError(null);
  }, [videoId]);

  const fetchSimulation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine the folder name and file name based on videoId
      const folderName = videoId === 'projectile_motion' ? 'projectile' : 
                         videoId === 'human_heart' ? 'human-heart' : videoId;
      const fileName = videoId === 'projectile_motion' ? 'projectile_motion.html' : 
                       videoId === 'human_heart' ? 'heart_interactive_real.html' : `${videoId}.html`;

      const url = `${CDN_BASE_URL}Media/Video/hackathon/${folderName}/${fileName}`;
      
      console.log("Fetching simulation from:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load simulation: ${response.status}`);
      }
      
      const html = await response.text();
      setHtmlContent(html);
      setHasStarted(true);
      setIsFullscreen(true);
    } catch (err) {
      console.error("Failed to fetch simulation:", err);
      setError(err instanceof Error ? err.message : 'Failed to load simulation');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = () => {
    fetchSimulation();
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setHasStarted(false);
  };

  // Placeholder screen
  if (!hasStarted && !loading) {
    return (
      <div className="flex flex-col h-full animate-fade-in group">
        <div className="flex-1 relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          {/* Background Image with optimized overlay for image visibility & text contrast */}
          <div className="absolute inset-0">
            <img 
              src="/simulation_lab.jpeg" 
              alt="Aakash Simulation Lab"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/40 to-transparent" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          {/* Content Container */}
          <div className="relative h-full flex flex-col p-8 z-10">
            {/* Header - Made smaller to save space */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 mb-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-blue-300">Virtual Lab Ready</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight">
                Interactive <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 uppercase tracking-tight">Simulation Experience</span>
              </h2>
            </div>

            {/* Instructions Section - Nested in a high-contrast dark box for maximum readability */}
            <div className="flex-1 min-h-0 w-full flex flex-col justify-center">
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl inline-block max-w-fit">
                <h3 className="text-white font-black text-sm mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How to Experiment
                </h3>
                <div className="grid gap-3">
                  {getInstructions(videoId).map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-black text-white shadow-lg shadow-blue-900/40">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-white font-bold whitespace-nowrap drop-shadow-sm">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button - Priority Visibility */}
            <div className="pt-6 mt-auto border-t border-white/5">
              <button 
                onClick={handlePlayClick}
                className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <span>Launch Simulation</span>
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-fade-in bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-bold text-lg animate-pulse">Loading Simulation Lab...</p>
        <p className="text-gray-500 text-sm mt-2">Preparing interactive experience</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-4 text-3xl">⚠️</div>
        <h4 className="font-black text-gray-900 text-xl mb-2">Simulation Not Available</h4>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => setHasStarted(false)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Return to Start
        </button>
      </div>
    );
  }

  // Fullscreen simulation
  if (isFullscreen && htmlContent) {
    return (
      <div className="fixed inset-0 z-50 bg-black animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleCloseFullscreen}
          className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xl border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close Simulation
        </button>

        {/* Simulation iframe */}
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0"
          title="Interactive Simulation"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    );
  }

  return null;
};

export default Simulation;
