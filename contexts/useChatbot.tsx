import { useState, useCallback, useEffect } from "react";
import { Flashcard, QuizQuestion } from "../types";

export interface Note {
  id: string;
  type: "h1" | "text";
  content: string;
}

// Mock Data Imports
import wavesFlashcards from "../mock-data/waves/video_waves_flashcards.json";
import wavesQuiz from "../mock-data/waves/video_waves_quiz.json";
import wavesSummaries from "../mock-data/waves/video_waves_summaries.json";
import projectileFlashcards from "../mock-data/projectile_motion/video_projectile_motion_flashcards.json";
import projectileQuiz from "../mock-data/projectile_motion/video_projectile_motion_quiz.json";
import projectileSummaries from "../mock-data/projectile_motion/video_projectile_motion_summaries.json";
import heartFlashcards from "../mock-data/human-heart/video_human_heart_flashcards.json";
import heartQuiz from "../mock-data/human-heart/video_human_heart_quiz.json";
import heartSummaries from "../mock-data/human-heart/video_human_heart_summaries.json";
import BatchResponse from "../mock-data/batch_api_response.json";

// const BACKEND_URL = "https://askdoubt-backend.onrender.com";
const BACKEND_URL = "http://localhost:5000";

const stripMarkdownAndHtml = (text: string) => {
  if (!text) return "";

  let cleanText = text
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove Markdown links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove bold/italic markers
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    // Remove headers
    .replace(/^#+\s+/gm, "")
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, "")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    // Remove horizontal rules
    .replace(/^-{3,}|^\*{3,}|^_{3,}/gm, "")
    // Remove lists
    .replace(/^\s*[-+*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove timestamp patterns like [00:15]
    .replace(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g, "");

  return cleanText.trim();
};

const useChatbot = () => {
  const [summaryHtml, setSummaryHtml] = useState<string | null>(null);
  const [visualViewContent, setVisualViewContent] = useState<any>(null);
  const [aiFlashCardsContent, setAiFlashCardsContent] = useState<Flashcard[]>(
    []
  );
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("study_notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    } else {
      // Default initial notes
      setNotes([
        { id: "1", type: "h1", content: "My Custom Study Notes" },
        {
          id: "2",
          type: "text",
          content:
            "Click here to start typing your thoughts on this lecture...",
        },
      ]);
    }
  }, []);

  // Persist notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("study_notes", JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = useCallback(
    (content: string, type: "h1" | "text" = "text", clean: boolean = true) => {
      const finalContent = clean ? stripMarkdownAndHtml(content) : content;

      setNotes((prev) => {
        const isDuplicate = prev.some(
          (n) => n.content.trim() === finalContent.trim() && n.type === type
        );
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            id: Date.now().toString(),
            type,
            content: finalContent,
          },
        ];
      });
    },
    []
  );

  const updateNote = useCallback((id: string, content: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.length > 1 ? prev.filter((n) => n.id !== id) : prev
    );
  }, []);

  const fetchSummary = useCallback(async (videoId?: string) => {
    // Try to get summary from BatchResponse local data first
    try {
      const batchResults = BatchResponse?.results?.results?.[videoId];
      const { data } = batchResults || {};
      const { summary, flashcards } = data || {};
      console.log(
        "Batch summary lookup for",
        data,
        batchResults,
        "found:",
        BatchResponse?.results?.results
      );
      setSummaryHtml(summary);
      return;
    } catch (err) {
      console.warn("Batch lookup failed", err);
    }

    // // existing mock fallbacks
    // if (videoId === "waves") {
    //   setSummaryHtml((wavesSummaries as any).final_summary);
    //   return;
    // }
    // if (videoId === "projectile_motion") {
    //   setSummaryHtml((projectileSummaries as any).final_summary);
    //   return;
    // }
    // if (videoId === "human_heart") {
    //   setSummaryHtml((heartSummaries as any).final_summary);
    //   return;
    // }

    // const url = `${BACKEND_URL}/get_summmary?video_id=${videoId || "waves"}`;
    // setLoading(true);
    // try {
    //   const response = await fetch(url);
    //   const data = await response.json();
    //   setSummaryHtml(data.final_summary);
    // } catch (error) {
    //   console.error("Error fetching summary:", error);
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  const fetchVisualView = useCallback(async () => {
    const url = `${BACKEND_URL}/visual-view`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setVisualViewContent(data.htmlContent);
    } catch (error) {
      console.error("Error fetching visual view:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAIFlashCards = useCallback(async (videoId?: string) => {
    // Try BatchResponse first
    try {
      const batchResults = BatchResponse?.results?.results?.[videoId];
      const { data } = batchResults || {};
      const { flashcards } = data || {};
      setAiFlashCardsContent(flashcards || []);
    } catch (err) {
      console.warn("Batch flashcards lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchMindMap = useCallback(async (videoId?: string) => {
    // Try BatchResponse first
    try {
      const batchResults = BatchResponse?.results?.results?.[videoId];
      const { data } = batchResults || {};
      const { mindmap } = data || {};
      setMindMapData(mindmap || []);
    } catch (err) {
      console.warn("Batch flashcards lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllChats = useCallback(
    async (
      videoId?: string,
      userId: string = "user123",
      sessionId: string = "session789"
    ) => {
      const url = `${BACKEND_URL}/get-all-chat?video_id=${
        videoId || "waves"
      }&user_id=${userId}&session_id=${sessionId}`;
      setLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setChatMessages(data?.data || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatMessages([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchQuiz = useCallback(async (videoId?: string) => {
    // Try BatchResponse first
    try {
      const batchResults = BatchResponse?.results?.results?.[videoId];
      const { data } = batchResults || {};
      const { quizzes } = data || {};
      setQuiz({ data: quizzes });
    } catch (err) {
      console.warn("Batch quiz lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summaryHtml,
    fetchSummary,
    visualViewContent,
    fetchVisualView,
    aiFlashCardsContent,
    fetchAIFlashCards,
    chatMessages,
    fetchAllChats,
    quiz,
    fetchQuiz,
    loading,
    notes,
    addNote,
    updateNote,
    deleteNote,
    fetchMindMap,
    mindMapData,
  };
};

export default useChatbot;
