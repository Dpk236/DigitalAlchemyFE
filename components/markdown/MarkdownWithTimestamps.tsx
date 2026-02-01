
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import "./index.css";
// import AskAIOverlay from "./AskAIOverlay"; // Currently unused in original file
// import { useTextSelection } from "./Contexts/useTextSelection"; // Ensure this path exists or adjust

interface MarkdownSummaryProps {
    content: string;
    onSeek?: (timestamp: string) => void;
    isDarkMode?: boolean;
}

const MarkdownSummary: React.FC<MarkdownSummaryProps> = ({ content, onSeek, isDarkMode = false }) => {
    const renderWithTimestamps = (children: React.ReactNode): React.ReactNode => {
        const nodes = Array.isArray(children) ? children : [children];

        return nodes.flatMap((child, idx) => {
            if (typeof child !== "string") return child;

            const parts = child.split(/(\[?\b(?:\d{1,2}:)?\d{1,2}:\d{2}\b\]?)/g);
            return parts.map((part, i) => {
                // Check if this part is a timestamp
                const cleanTime = part.replace(/[\[\]]/g, "");
                if (/^(?:\d{1,2}:)?\d{1,2}:\d{2}$/.test(cleanTime)) {
                    return (
                        <span
                            key={`${idx}-${i}`}
                            className="timestamp-pill"
                            style={{
                                color: '#4A90E2',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            data-tooltip={`Click to jump to ${part}`}
                            onClick={() => onSeek?.(cleanTime)}
                        >
                            {cleanTime}
                        </span>
                    );
                }

                return part;
            });
        });
    };

    const textColor = isDarkMode ? "text-gray-200" : "text-gray-500";
    const headingColor = isDarkMode ? "text-white" : "text-gray-900";

    const components: Components = {
        h1: ({ children }) => <h1 className={`md-heading-h1 ${headingColor}`}>{children}</h1>,
        h2: ({ children }) => <h2 className={`md-heading ${headingColor}`}>{children}</h2>,
        h3: ({ children }) => <h3 className={`md-subheading ${headingColor}`}>{children}</h3>,
        p: ({ children }) => (
            <p className={`md-paragraph ${textColor}`} style={{}}>
                {renderWithTimestamps(children)}
            </p>
        ),
        li: ({ children }) => (
            <li className={`md-list-item ${textColor}`}>{renderWithTimestamps(children)}</li>
        ),
        strong: ({ children }) => <strong className={`md-strong ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{children}</strong>,
    };

    /*
    const handleAskAI = (selectedText: string) => {
      console.log("selectedTextselectedText", selectedText);
      console.log(`Explain this from the lecture: "${selectedText}"`);
      // clear();
    };
    */

    const preprocessContent = (text: string) => {
        if (!text) return "";
        return text
            .replace(/<html>|<\/html>|<body>|<\/body>|<ul>|<\/ul>/gi, "")
            .replace(/<li>/gi, "- ")
            .replace(/<\/li>/gi, "\n")
            .replace(/<i>|<\/i>/gi, "*")
            .replace(/<br\s*\/?>/gi, "\n")
            .trim();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {preprocessContent(content)}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownSummary;
