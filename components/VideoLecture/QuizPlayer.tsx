
import React, { useState } from "react";

interface Question {
    question_text: string;
    options: Record<string, string>;
    correct_option: string;
    explanation: string;
}

interface QuizPlayerProps {
    title: string;
    questions: Question[];
    isDarkMode?: boolean;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ title, questions, isDarkMode = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);

    const current = questions[currentIndex];

    const handleSelect = (key: string) => {
        if (selected) return;
        setSelected(key);
    };

    const goNext = () => {
        setSelected(null);
        setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
    };

    const goPrev = () => {
        setSelected(null);
        setCurrentIndex((i) => Math.max(i - 1, 0));
    };

    const containerClass = isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
    const optionBaseClass = isDarkMode
        ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100";

    if (!current) return <div>No questions available</div>;

    return (
        <div className={`quiz-container h-full p-0 flex flex-col ${containerClass}`}>
            {/* Header */}
            <div className="quiz-header flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{title}</h2>
                <span className="dots text-gray-400">•••</span>
            </div>

            {/* Progress */}
            <div className="quiz-progress flex items-center justify-between mb-8 bg-opacity-20 bg-gray-500 p-2 rounded-lg">
                <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={`px-3 py-1 rounded ${currentIndex === 0 ? "opacity-30" : "hover:bg-gray-600"}`}
                >
                    ‹
                </button>
                <span className="font-mono">{currentIndex + 1} / {questions.length}</span>
                <button
                    onClick={goNext}
                    disabled={currentIndex === questions.length - 1}
                    className={`px-3 py-1 rounded ${currentIndex === questions.length - 1 ? "opacity-30" : "hover:bg-gray-600"}`}
                >
                    ›
                </button>
            </div>

            {/* Question */}
            <h3 className="quiz-question text-lg font-medium mb-6 leading-relaxed">{current.question_text}</h3>

            {/* Options */}
            <div className="quiz-options space-y-3">
                {Object.entries(current.options).map(([key, text]) => {
                    const isCorrect = key === current.correct_option;
                    const isWrong = selected === key && key !== current.correct_option;

                    let optionClass = `quiz-option p-4 rounded-lg border cursor-pointer transition-colors flex items-center justify-between `;

                    if (selected && isCorrect) {
                        optionClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-100 dark:border-green-600";
                    } else if (isWrong) {
                        optionClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-600";
                    } else {
                        optionClass += optionBaseClass;
                    }

                    return (
                        <div
                            key={key}
                            className={optionClass}
                            onClick={() => handleSelect(key)}
                        >
                            <div className="flex items-center">
                                <span className="option-label font-bold mr-3 w-6">{key}</span>
                                <span className="option-text">{text}</span>
                            </div>

                            {selected && isCorrect && <span className="icon green text-green-600 dark:text-green-400">✔</span>}
                            {isWrong && <span className="icon red text-red-600 dark:text-red-400">✖</span>}
                        </div>
                    );
                })}
            </div>

            {/* Explanation */}
            {selected && (
                <div className={`quiz-explanation mt-6 p-4 rounded-lg ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-blue-50 text-blue-900"}`}>
                    <strong className="block mb-1">Explanation</strong>
                    <p className="text-sm opacity-90">{current.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default QuizPlayer;
