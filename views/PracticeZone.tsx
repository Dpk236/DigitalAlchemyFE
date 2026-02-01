
import React, { useState } from 'react';

interface PracticeZoneProps {
  onAskAI: (context: string) => void;
}

const PracticeZone: React.FC<PracticeZoneProps> = ({ onAskAI }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const question = {
    text: "A 5kg block is pulled on a rough horizontal surface (μ = 0.2) by a force of 20N. What is the acceleration of the block? (Take g = 10 m/s²)",
    options: ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
    correct: 1, // 2 m/s²
    explanation: "Frictional force f = μmg = 0.2 * 5 * 10 = 10N. Net force F_net = Applied Force - friction = 20 - 10 = 10N. Acceleration a = F_net / m = 10 / 5 = 2 m/s²."
  };

  const handleReasoningHelp = () => {
    onAskAI(`Problem: "${question.text}". 
    My thinking: ${selectedAnswer !== null ? `I chose ${question.options[selectedAnswer]}` : "I'm not sure how to start"}. 
    Please identify where my reasoning might be breaking down and explain the free body diagram steps.`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Question 14 / Mechanics</span>
          <div className="flex gap-2">
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">+4</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">-1</span>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-8">
            {question.text}
          </h3>

          <div className="space-y-4">
            {question.options.map((opt, i) => (
              <button
                key={i}
                disabled={isSubmitted}
                onClick={() => setSelectedAnswer(i)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                  selectedAnswer === i 
                    ? isSubmitted 
                      ? i === question.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                      : 'border-blue-600 bg-blue-50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${
                    selectedAnswer === i ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-400 border-slate-200'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-semibold text-slate-700">{opt}</span>
                </div>
                {isSubmitted && i === question.correct && (
                  <span className="text-green-600 font-bold">✓ Correct</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex justify-between items-center">
          <button 
            onClick={handleReasoningHelp}
            className="text-blue-600 font-bold hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>💡</span> Help me understand
          </button>
          
          <div className="flex gap-4">
            {!isSubmitted ? (
              <button 
                onClick={() => setIsSubmitted(true)}
                disabled={selectedAnswer === null}
                className={`px-8 py-2 rounded-lg font-bold transition-all ${
                  selectedAnswer === null ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button className="bg-slate-800 text-white px-8 py-2 rounded-lg font-bold">
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>

      {isSubmitted && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 animate-fade-in shadow-xl shadow-blue-50">
          <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span>📚</span> Conceptual Explanation
          </h4>
          <p className="text-slate-700 leading-relaxed">
            {question.explanation}
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100 flex gap-4">
             <button onClick={() => onAskAI(`Explain the concept of 'Net Force' and how it differs from 'Applied Force' in this friction problem.`)} className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-2 rounded-full hover:bg-blue-100">
               Why subtract friction?
             </button>
             <button onClick={() => onAskAI(`What happens if the surface was frictionless? Show calculation.`)} className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-2 rounded-full hover:bg-blue-100">
               Case: No Friction
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeZone;
