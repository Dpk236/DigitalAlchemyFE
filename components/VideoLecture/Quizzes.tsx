import React, { useEffect, useState } from 'react';
import useChatbot from '../../contexts/useChatbot';
import QuizPlayer from './QuizPlayer';
import PreviousYearQuestions from './PreviousYearQuestions';
import PracticeMock from './PracticeMock';

const Quizzes: React.FC = () => {
  const { quiz = {}, fetchQuiz, loading } = useChatbot();
  const [activeMode, setActiveMode] = useState<'Practice' | 'PYQ' | 'PracticeMock'>('Practice');

  // Safe destructuring with defaults
  const questions = quiz?.data?.questions || [];
  const quiz_title = quiz?.data?.quiz_title || "Quiz";
  const isDarkMode = false;

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Challenge Zone</h3>
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveMode('Practice')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'Practice' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveMode('PracticeMock')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'PracticeMock' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            Practice Mock
          </button>
          <button
            onClick={() => setActiveMode('PYQ')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'PYQ' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            NEET PYQs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <div className="w-12 h-12 border-4 border-gray-50 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Synthesizing Questions...</p>
        </div>
      ) : (
        <div className="">
          {activeMode === 'Practice' ? (
            !!questions?.length && (
              <QuizPlayer title={quiz_title} questions={questions} isDarkMode={isDarkMode} />
            )
          ) : activeMode === 'PracticeMock' ? (
            <PracticeMock />
          ) : (
            <PreviousYearQuestions />
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
