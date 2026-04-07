
import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import "./index.css";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// import AskAIOverlay from "./AskAIOverlay"; // Currently unused in original file
// import { useTextSelection } from "./Contexts/useTextSelection"; // Ensure this path exists or adjust

interface MarkdownSummaryProps {
    content: string;
    onSeek?: (timestamp: string) => void;
    isDarkMode?: boolean;
}

const MarkdownSummary: React.FC<MarkdownSummaryProps> = ({ content, onSeek, isDarkMode = false }) => {
    // Matches: [00:55], [1:23:45] (colon-based) OR [478.44], [554.44] (decimal seconds)
    const TIMESTAMP_REGEX = /(\[(?:\d{1,2}:)?\d{1,2}:\d{2}\]|\[\d+(?:\.\d+)?\])/g;

    /** Convert decimal seconds → "M:SS" display label */
    const formatDecimalSeconds = (secs: number): string => {
        const totalSec = Math.floor(secs);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const renderWithTimestamps = (children: React.ReactNode): React.ReactNode => {
        const nodes = Array.isArray(children) ? children : [children];

        return nodes.flatMap((child, idx) => {
            if (typeof child !== "string") return child;

            const parts = child.split(TIMESTAMP_REGEX);
            return parts.map((part, i) => {
                const cleanValue = part.replace(/[\[\]]/g, "");

                // Colon-based timestamp: 00:55, 1:23:45
                const isColonTimestamp = /^(?:\d{1,2}:)?\d{1,2}:\d{2}$/.test(cleanValue);

                // Decimal-seconds timestamp: 478.44, 308, 554.44
                const isDecimalTimestamp = /^\d+(?:\.\d+)?$/.test(cleanValue) && part.startsWith('[');

                if (isColonTimestamp || isDecimalTimestamp) {
                    // Display label: colon format shown as-is; decimal shown as M:SS
                    const displayLabel = isDecimalTimestamp
                        ? formatDecimalSeconds(parseFloat(cleanValue))
                        : cleanValue;

                    return (
                        <span
                            key={`${idx}-${i}`}
                            className="timestamp-pill"
                            style={{
                                color: '#4A90E2',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            data-tooltip={`Click to jump to ${displayLabel}`}
                            onClick={() => onSeek?.(cleanValue)}
                        >
                            {displayLabel}
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
            // Remove common block-level HTML tags
            .replace(/<html>|<\/html>|<body>|<\/body>|<ul>|<\/ul>|<ol>|<\/ol>/gi, "")
            .replace(/<p>|<\/p>/gi, "\n\n")
            .replace(/<div>|<\/div>/gi, "\n")
            // Convert list items to markdown
            .replace(/<li>/gi, "- ")
            .replace(/<\/li>/gi, "\n")
            // Convert inline formatting to markdown
            .replace(/<i>|<\/i>|<em>|<\/em>/gi, "*")
            .replace(/<b>|<\/b>|<strong>|<\/strong>/gi, "**")
            // Convert line breaks
            .replace(/<br\s*\/?>/gi, "\n")
            // Remove any remaining HTML tags (catch-all)
            .replace(/<[^>]+>/g, "")
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
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]} components={components}>
                {preprocessContent(content)}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownSummary;
