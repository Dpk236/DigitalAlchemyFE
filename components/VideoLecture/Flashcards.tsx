
import React from 'react';
import AIFlashcardPlayer from './AIFlashcardPlayer';

const Flashcards: React.FC = () => {
  return (
    <div className="animate-fade-in pb-10">
      <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Revision Cards</h3>
      <AIFlashcardPlayer />
    </div>
  );
};

export default Flashcards;
