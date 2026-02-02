import React, { useState } from 'react';
import heartPYQData from '../../mock-data/previous-mock.json';
import wavesPYQData from '../../mock-data/waves/previous-year-questions.json';
import projectilePYQData from '../../mock-data/projectile_motion/previous-year-questions.json';
import heartPYQData_new from '../../mock-data/human-heart/previous-year-questions.json';

import MarkdownRenderer from '../markdown/MarkdownRenderer';

interface PreviousYearQuestionsProps {
    videoId: string;
}

const PreviousYearQuestions: React.FC<PreviousYearQuestionsProps> = ({ videoId }) => {
    const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});

    // Select PYQ data based on videoId
    const getPYQData = () => {
        if (videoId === 'waves') return wavesPYQData;
        if (videoId === 'projectile_motion') return projectilePYQData;
        if (videoId === 'human_heart') return heartPYQData_new;
        return heartPYQData;
    };


    const pyqData = getPYQData() as any;

    const teacherNote = pyqData.NEET_Biology_Teacher_Note || pyqData.Teacher_Note || "Hello students! Here are some high-yield questions from previous years.";
    const tips = (pyqData.Student_Tips_on_Wave_Motion || 
                 pyqData.Student_Tips_on_Projectile_Motion || 
                 pyqData.Student_Tips_on_Circulatory_Motion || 
                 pyqData.Student_Tips || {}) as Record<string, string>;

    const toggleAnswer = (index: number) => {
        setShowAnswer(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Teacher's Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">👨‍⚕️</span>
                    <h4 className="font-black text-blue-900 uppercase tracking-tight text-sm">Teacher's Note</h4>
                </div>
                <div className="text-sm text-blue-800 leading-relaxed font-medium italic">
                    <MarkdownRenderer content={teacherNote} />
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Previous Year Questions</h3>
                    <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase">
                        {(pyqData.Previous_Year_Questions?.length || 0)} Questions
                    </span>
                </div>

                {(pyqData.Previous_Year_Questions as any[] || []).map((q, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase shadow-lg shadow-blue-500/20">
                                NEET {q.NEET_Year}
                            </span>
                        </div>
                        <div className="text-gray-800 font-bold text-sm leading-relaxed mb-6 group-hover:text-blue-900 transition-colors">
                            <MarkdownRenderer content={q.Question} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            {Object.entries(q.Options || {}).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                                    <span className="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 uppercase">{key}</span>
                                    <div className="text-xs text-gray-600 font-medium">
                                        <MarkdownRenderer content={value as any} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => toggleAnswer(idx)}
                            className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${showAnswer[idx]
                                    ? 'bg-green-50 text-green-600 border border-green-100'
                                    : 'bg-gray-900 text-white hover:bg-blue-600'
                                }`}
                        >
                            {showAnswer[idx] ? `Correct Answer: ${q.Answer}` : 'Reveal Answer'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Tips Section */}
            <div className="space-y-4 pt-4">
                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Study Tips: {videoId === 'waves' ? 'Waves' : videoId === 'projectile_motion' ? 'Projectile Motion' : 'Circulatory Motion'}</h3>
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(tips).map(([key, tip]: [string, any], idx) => (
                        <div key={key} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-100 transition-all">
                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</div>
                            <div className="text-xs text-gray-600 leading-relaxed font-medium">
                                <span className="text-gray-900 font-black block mb-1 uppercase tracking-tighter text-[10px]">{key.replace('_', ' ')}</span>
                                <MarkdownRenderer content={tip as any} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PreviousYearQuestions;
