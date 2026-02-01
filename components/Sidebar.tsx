
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/video-lecture', label: 'Video Lectures', icon: '🎥' },
    { path: '/study-material', label: 'Study Material', icon: '📚' },
    { path: '/practice', label: 'Practice Zone', icon: '✍️' },
    { path: '/revision', label: 'Revision Hub', icon: '🔄' },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-black text-indigo-700 flex items-center gap-2 tracking-tighter">
          <div className="bg-indigo-700 text-white p-1 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a4 4 0 01-2.574.344l-3.147-.63a2 2 0 01-1.583-1.798V5.083a2 2 0 011.583-1.798l3.147-.63a4 4 0 012.574.344l.675.337a6 6 0 003.86.517l2.387-.477a2 2 0 011.022.547l3.561 3.561a2 2 0 010 2.828l-3.561 3.561z" />
            </svg>
          </div>
          <span className="leading-none">Digital Alchemy</span>
        </h1>
        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em] font-black">AI Learning Engine</p>
      </div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all ${location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40?seed=userprofile" className="rounded-full w-10 h-10 border-2 border-indigo-100 shadow-sm" alt="Profile" />
          <div>
            <p className="text-sm font-black text-gray-900">Aryan Sharma</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">JEE Aspirant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
