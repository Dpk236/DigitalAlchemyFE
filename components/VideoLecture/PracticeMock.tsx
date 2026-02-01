
import React, { useState, useEffect, useCallback } from 'react';
import mockData from '../../mock-data/PraticeMock.json';

const PracticeMock: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const questions = mockData.quiz.questions;
    const currentQuestion = questions[currentIndex];

    // Timer Logic
    useEffect(() => {
        if (!isStarted || timeLeft <= 0 || isSubmitted) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isStarted, timeLeft, isSubmitted]);

    // Format time (MM:SS)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionIdx: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [currentIndex]: optionIdx }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] !== undefined && q.answerOptions[answers[idx]].isCorrect) {
                score++;
            }
        });
        return score;
    };

    if (!isStarted) {
        return (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center shadow-sm animate-fade-in">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⏱️</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Practice Mock Session</h2>
                <div className="space-y-4 max-w-sm mx-auto mb-8 text-left">
                    <div className="flex gap-3">
                        <span className="text-blue-500 font-black">01</span>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">10 Multiple choice questions covering Circulatory Pathways.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-blue-500 font-black">02</span>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">10 Minutes total time (1 minute per question).</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-blue-500 font-black">03</span>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">Detailed performance review after submission.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsStarted(true)}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all"
                >
                    Start Test Now →
                </button>
            </div>
        );
    }

    if (isSubmitted) {
        const score = calculateScore();
        return (
            <div className="space-y-6 animate-fade-in pb-6">
                <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 text-center shadow-xl shadow-blue-500/5">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏆</span>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Quiz Results</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-6">Simulation Complete</p>

                    <div className="flex justify-center gap-10 mb-6">
                        <div>
                            <div className="text-3xl font-black text-blue-600">{score}/10</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Score</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-green-500">{Math.round((score / 10) * 100)}%</div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Accuracy</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-[11px] text-blue-900 font-bold leading-relaxed italic">
                            "{mockData.encouragement}"
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-black text-gray-900 text-base uppercase tracking-tight">Detailed Review</h3>
                    {questions.map((q, idx) => {
                        const isCorrect = answers[idx] !== undefined && q.answerOptions[answers[idx]].isCorrect;
                        const correctOption = q.answerOptions.find(opt => opt.isCorrect);

                        return (
                            <div key={idx} className={`p-4 rounded-2xl border-2 transition-all ${isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                <div className="flex items-start gap-3 mb-3">
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {idx + 1}
                                    </span>
                                    <h4 className="font-bold text-xs text-gray-800 leading-relaxed">{q.question}</h4>
                                </div>

                                {!isCorrect && (
                                    <div className="ml-10">
                                        <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5">Your Answer</div>
                                        <div className="text-[11px] text-red-800 font-medium mb-3">{answers[idx] !== undefined ? q.answerOptions[answers[idx]].text : 'Not Answered'}</div>

                                        <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-0.5">Correct Answer</div>
                                        <div className="text-[11px] text-green-800 font-bold">{correctOption?.text}</div>
                                        <p className="mt-1.5 text-[10px] text-green-700 bg-green-100/50 p-2.5 rounded-lg border border-green-100 italic">
                                            {correctOption?.rationale}
                                        </p>
                                    </div>
                                )}

                                {isCorrect && (
                                    <div className="ml-10">
                                        <div className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-0.5">Correctly Answered</div>
                                        <div className="text-[11px] text-green-800 font-bold">{q.answerOptions[answers[idx]].text}</div>
                                        <p className="mt-1.5 text-[10px] text-green-700 bg-green-100/50 p-2.5 rounded-lg border border-green-100 italic">
                                            {q.answerOptions[answers[idx]].rationale}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in relative pb-6">
            {/* Top Bar with Timer */}
            <div className="flex items-center justify-between bg-gray-900 text-white p-3 rounded-xl shadow-xl shadow-gray-900/10">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black bg-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Q {currentIndex + 1}/10</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Remaining</span>
                    <span className={`text-lg font-black font-mono w-16 text-center ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 leading-relaxed mb-6">
                    {currentQuestion.question}
                </h3>

                <div className="grid grid-cols-1 gap-3 flex-1">
                    {currentQuestion.answerOptions.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${answers[currentIndex] === idx
                                    ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/10'
                                    : 'bg-gray-50/50 border-transparent hover:border-gray-200'
                                }`}
                        >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${answers[currentIndex] === idx
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-100 text-gray-400 group-hover:text-gray-600'
                                }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className={`text-[13px] font-bold transition-colors ${answers[currentIndex] === idx ? 'text-blue-900' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {opt.text}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Hint Dropdown */}
                <div className="mt-6">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                    >
                        <span>💡 {showHint ? 'Hide Hint' : 'Show Hint'}</span>
                        <svg className={`w-2.5 h-2.5 transition-transform ${showHint ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {showHint && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-xl animate-fade-in">
                            <p className="text-[11px] text-orange-900 leading-relaxed font-medium capitalize-first">
                                {currentQuestion.hint}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Bottom Bar */}
            <div className="flex items-center justify-between pt-2">
                <button
                    disabled={currentIndex === 0}
                    onClick={() => {
                        setCurrentIndex(idx => idx - 1);
                        setShowHint(false);
                    }}
                    className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentIndex === 0 ? 'opacity-30 pointer-events-none' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                >
                    ← Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-gray-900/10 hover:shadow-blue-500/20 transition-all"
                    >
                        Submit Performance →
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setCurrentIndex(idx => idx + 1);
                            setShowHint(false);
                        }}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-gray-900/10 hover:shadow-blue-500/20 transition-all"
                    >
                        Next Question →
                    </button>
                )}
            </div>
        </div>
    );
};

export default PracticeMock;
