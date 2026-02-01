
import React, { useState } from 'react';
import { generateFlashcards, generateQuiz } from '../services/gemini';
import { Flashcard, QuizQuestion } from '../types';

const RevisionHub: React.FC = () => {
  const [topic, setTopic] = useState('Rotational Dynamics');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const handleGenerateRevision = async () => {
    setIsLoading(true);
    try {
      const cards = await generateFlashcards(topic);
      const questions = await generateQuiz(topic);
      setFlashcards(cards);
      setQuiz(questions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlip = (id: string) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Revision Hub</h2>
        <p className="text-blue-100 mb-8 opacity-80">Generate targeted revision materials based on your syllabus or recent confusion points.</p>

        <div className="flex gap-4 max-w-xl">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40"
            placeholder="Enter topic (e.g. Thermodynamics)..."
          />
          <button
            onClick={handleGenerateRevision}
            disabled={isLoading}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate Materials"}
          </button>
        </div>
      </div>

      {flashcards.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Flashcards</h3>
              <p className="text-slate-500">Master the basics with active recall</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{flashcards.length} Cards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card) => (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="h-64 cursor-pointer group perspective-1000"
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-2xl ${flipped[card.id] ? 'rotate-y-180' : ''}`}>
                  <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 p-8 flex flex-col items-center justify-center text-center rounded-2xl">
                    <span className="absolute top-4 left-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.subject}</span>
                    <p className="text-lg font-bold text-slate-800 leading-snug">{card.front}</p>
                    <p className="absolute bottom-4 text-xs text-slate-400">Click to flip</p>
                  </div>
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-600 p-8 flex flex-col items-center justify-center text-center rounded-2xl text-white">
                    <p className="text-sm leading-relaxed">{card.back}</p>
                    <p className="absolute bottom-4 text-xs text-blue-200">Click to flip back</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {quiz.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Adaptive Practice</h3>
              <p className="text-slate-500">Test your understanding of {topic}</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{quiz.length} Questions</span>
          </div>

          <div className="space-y-1">
            {quiz.map((q, i) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <p className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-widest">Question {i + 1}</p>
                <h4 className="text-xl font-bold text-slate-800 mb-6">{q.question}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border-2 border-slate-100 font-semibold text-slate-700 ${idx === q.correctIndex ? 'bg-green-50 border-green-100 text-green-800' : ''}`}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-500">ℹ️</span> Reasoning
                  </h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{q.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLoading && flashcards.length === 0 && (
        <div className="text-center py-20 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-slate-500 font-medium">Enter a topic above to generate study materials.</p>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default RevisionHub;
