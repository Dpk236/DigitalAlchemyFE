
import React from 'react';

interface SubjectFiltersProps {
    activeSubject: string;
    setActiveSubject: (subject: string) => void;
}

const SubjectFilters: React.FC<SubjectFiltersProps> = ({ activeSubject, setActiveSubject }) => {
    const subjects = [
        { id: 'PHYSICS', label: 'Physics', icon: '⚛️' },
        { id: 'CHEMISTRY', label: 'Chemistry', icon: '⚗️' },
        { id: 'MATHEMATICS', label: 'Mathematics', icon: '∑' },
        { id: 'BIOLOGY', label: 'Biology', icon: '🧬' },
    ];

    return (
        <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
                {subjects.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => setActiveSubject(sub.id)}
                        className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${activeSubject === sub.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200 hover:text-gray-600 shadow-sm'
                            }`}
                    >
                        <span className={activeSubject === sub.id ? 'text-white' : 'text-gray-400'}>{sub.icon}</span>
                        {sub.label}
                    </button>
                ))}
            </div>
            <div className="relative">
                <button className="flex items-center gap-4 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 shadow-sm hover:border-gray-200 transition-all">
                    <span className="text-gray-400 font-medium">Sort by:</span>
                    Recent First
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SubjectFilters;
