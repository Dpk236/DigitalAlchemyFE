
import React, { useState, useEffect } from 'react';

interface SimulationProps {
  videoId: string;
}

const CDN_BASE_URL = "https://d29zr2abydv3bb.cloudfront.net/";

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
      const folderName = videoId === 'projectile_motion' ? 'projectile' : videoId;
      const fileName = videoId === 'projectile_motion' ? 'projectile_motion.html' : `${videoId}.html`;
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
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex-1 relative bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
          onClick={handlePlayClick}
        >
          {/* Background Image */}
          <img 
            src="/simulation_lab.jpeg" 
            alt="Aakash Simulation Lab"
            className="w-full h-full object-cover opacity-90"
          />
          
          {/* Overlay - subtle hover effect */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Launch Simulation Lab</span>
              </div>
            </div>
          </div>
        </div>
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
          className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-2xl border border-white/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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


