
import React, { useState } from 'react';
import useChatbot from '../../contexts/useChatbot';
// import "./index.css"; // Assuming styles are global or handled via Tailwind

interface AIFlashcardPlayerProps {
    isDarkMode?: boolean;
}

const AIFlashcardPlayer: React.FC<AIFlashcardPlayerProps> = ({ isDarkMode = false }) => {
    const { aiFlashCardsContent = [], fetchAIFlashCards } = useChatbot();

    React.useEffect(() => {
        fetchAIFlashCards();
    }, [fetchAIFlashCards]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const total = aiFlashCardsContent?.length || 0;
    const progress = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

    const card = total > 0 ? aiFlashCardsContent[currentIndex] : null;

    // Theme colors
    const containerBg = isDarkMode
        ? 'linear-gradient(180deg, #1f2937, #111827)'
        : 'linear-gradient(180deg, #6d7ce8, #7a63c9)';

    const cardFrontBg = isDarkMode
        ? 'linear-gradient(180deg, #374151 0%, #1f2937 100%)'
        : 'linear-gradient(180deg, #6d7ce8 0%, #7a63c9 100%)';

    const cardBackBg = isDarkMode
        ? 'linear-gradient(180deg, #db2777 0%, #be185d 100%)'
        : 'linear-gradient(180deg, #fca5f1 0%, #f472b6 100%)';

    if (!card) return (
        <div className="p-20 text-center">
            <p className="text-gray-500 italic">No flashcards available.</p>
        </div>
    );

    return (
        <div
            style={{
                height: 'calc(100vh - 130px)',
                background: containerBg,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                borderRadius: "12px",
                color: '#fff'
            }}
        >
            {/* TOP INFO */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                Card {currentIndex + 1} of {total} &nbsp; | &nbsp; Progress: {progress}%
            </div>

            {/* PROGRESS BAR */}
            <div
                style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '40px'
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: '#facc15',
                        borderRadius: '8px',
                        transition: 'width 0.3s'
                    }}
                />
            </div>

            {/* CARD AREA */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '1200px',
                    cursor: "pointer",
                }}
                onClick={() => setIsFlipped((prev) => !prev)}
            >
                <div
                    style={{
                        width: '420px',
                        minHeight: '260px',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.7s ease',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                >
                    {/* QUESTION */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backfaceVisibility: 'hidden',
                            borderRadius: '20px',
                            padding: '24px',
                            background: cardFrontBg,
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <CenterText>
                            <h2 style={{ color: '#fff', fontSize: '1.8em', fontWeight: '700', marginBottom: '20px', lineHeight: 1.3 }}>
                                {card.front || card.question /* Types might differ, handle both */}
                            </h2>
                            <p className='flashcard-hint' style={{ fontSize: '0.8em', opacity: 0.8 }}>
                                Click to flip
                            </p>
                        </CenterText>
                    </div>

                    {/* ANSWER */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderRadius: '20px',
                            padding: '24px',
                            background: cardBackBg,
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <CenterText>
                            <p style={{ fontSize: '16px', lineHeight: 1.6 }}>{card.back || card.answer}</p>
                        </CenterText>
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                }}
            >
                <button
                    disabled={currentIndex === 0}
                    onClick={() => {
                        setCurrentIndex((i) => Math.max(0, i - 1));
                        setIsFlipped(false);
                    }}
                    style={buttonStyle(currentIndex === 0, isDarkMode)}
                >
                    ← Previous
                </button>

                <button onClick={() => setIsFlipped((f) => !f)} style={buttonStyle(false, isDarkMode)}>
                    🔄 Flip Card
                </button>

                <button
                    disabled={currentIndex === total - 1}
                    onClick={() => {
                        setCurrentIndex((i) => Math.min(total - 1, i + 1));
                        setIsFlipped(false);
                    }}
                    style={buttonStyle(currentIndex === total - 1, isDarkMode)}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default AIFlashcardPlayer;

/* ---------- Helpers ---------- */

const CenterText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div
        style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px'
        }}
    >
        {children}
    </div>
);

const buttonStyle = (disabled = false, isDarkMode = false): React.CSSProperties => ({
    padding: '12px 20px',
    borderRadius: '999px',
    border: 'none',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    background: isDarkMode ? '#374151' : '#fff',
    color: isDarkMode ? '#fff' : '#000'
});
