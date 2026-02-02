
import { useState, useCallback } from "react";
import { Flashcard, QuizQuestion } from "../types";

// Mock Data Imports
import wavesFlashcards from "../mock-data/waves/video_waves_flashcards.json";
import wavesQuiz from "../mock-data/waves/video_waves_quiz.json";
import wavesSummaries from "../mock-data/waves/video_waves_summaries.json";
import projectileFlashcards from "../mock-data/projectile_motion/video_projectile_motion_flashcards.json";
import projectileQuiz from "../mock-data/projectile_motion/video_projectile_motion_quiz.json";
import projectileSummaries from "../mock-data/projectile_motion/video_projectile_motion_summaries.json";

const BACKEND_URL = "https://askdoubt-backend.onrender.com";

const useChatbot = () => {
  const [summaryHtml, setSummaryHtml] = useState<string | null>(null);
  const [visualViewContent, setVisualViewContent] = useState<any>(null);
  const [aiFlashCardsContent, setAiFlashCardsContent] = useState<Flashcard[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSummary = useCallback(async (videoId?: string) => {
    if (videoId === "waves") {
      setSummaryHtml((wavesSummaries as any).final_summary);
      return;
    }
    if (videoId === "projectile_motion") {
      setSummaryHtml((projectileSummaries as any).final_summary);
      return;
    }

    const url = `${BACKEND_URL}/get_summmary?video_id=${videoId || 'waves'}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSummaryHtml(data.final_summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
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
    if (videoId === "waves") {
      setAiFlashCardsContent(wavesFlashcards as any);
      return;
    }
    if (videoId === "projectile_motion") {
      setAiFlashCardsContent(projectileFlashcards as any);
      return;
    }

    const url = `${BACKEND_URL}/ai-flashcards?video_id=${videoId || 'waves'}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setAiFlashCardsContent(data.data);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllChats = useCallback(async (videoId?: string, userId: string = "user123", sessionId: string = "session789") => {
    const url = `${BACKEND_URL}/get-all-chat?video_id=${videoId || 'waves'}&user_id=${userId}&session_id=${sessionId}`;
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
  }, []);

  const fetchQuiz = useCallback(async (videoId?: string) => {
    if (videoId === "waves") {
      setQuiz({ data: wavesQuiz });
      return;
    }
    if (videoId === "projectile_motion") {
      setQuiz({ data: projectileQuiz });
      return;
    }

    const url = `${BACKEND_URL}/get-quiz?video_id=${videoId || 'waves'}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      // Store the whole data object which presumably contains { questions: [], title: "" }
      setQuiz(data || {});
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setQuiz({});
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
    loading
  };
};

export default useChatbot;
