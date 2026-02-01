
import React from 'react';
import { TabType } from '../../types';

interface TabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-white overflow-x-auto scrollbar-hide shrink-0">
      {(['Chat', 'Flashcards', 'Challenge Zone', 'Simulation', 'Summary', 'Notes'] as TabType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          {tab === 'Summary' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
          {tab === 'Chat' && <span>💬</span>}
          {tab === 'Flashcards' && <span>🗂️</span>}
          {tab === 'Challenge Zone' && <span>📝</span>}
          {tab === 'Simulation' && <span>🧊</span>}
          {tab === 'Notes' && <span>🗒️</span>}
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
