
import React from 'react';
import ThreeScene from './ThreeScene';

const Simulation: React.FC = () => {
  return (
    <div className="flex flex-col h-full animate-fade-in space-y-1">
      <div className="shrink-0">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Interactive 3D Simulation</h3>
        <p className="text-sm text-gray-400 mt-1">Abstract concept visualization using spatial models.</p>
      </div>
      <div className="flex-1 min-h-[350px]">
        <ThreeScene />
      </div>
      <div className="bg-gray-900 p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Simulation Metadata</p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">
          The model visualizes data flow between nodes. The central nucleus represents the primary state, while orbiting nodes represent side-effect handlers.
        </p>
      </div>
    </div>
  );
};

export default Simulation;
