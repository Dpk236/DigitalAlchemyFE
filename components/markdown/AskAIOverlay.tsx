
import React from 'react';

interface AskAIOverlayProps {
    text: string | null;
    position: { top: number; left: number } | null;
    onAsk: (text: string) => void;
}

const AskAIOverlay: React.FC<AskAIOverlayProps> = ({ text, position, onAsk }) => {
    if (!text || !position) return null;

    return (
        <button
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                transform: "translateX(-50%)",
                zIndex: 1000,
                padding: "6px 12px",
                borderRadius: 20,
                background: "#ff7a18",
                color: "#fff",
                border: "none",
                cursor: "pointer",
            }}
            onClick={() => onAsk(text)}
        >
            Ask AI
        </button>
    );
};

export default AskAIOverlay;
