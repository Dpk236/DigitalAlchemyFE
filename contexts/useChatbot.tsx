
import { useState, useCallback } from "react";
import { Flashcard, QuizQuestion } from "../types";

const useChatbot = () => {
  const [summaryHtml, setSummaryHtml] = useState<string | null>(null);
  const [visualViewContent, setVisualViewContent] = useState<any>(null);
  const [aiFlashCardsContent, setAiFlashCardsContent] = useState<Flashcard[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSummary = useCallback(async () => {
    const url = "http://localhost:5000/get_summmary";
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
    const url = "http://localhost:5000/visual-view";
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

  const fetchAIFlashCards = useCallback(async () => {
    const url = "http://localhost:5000/ai-flashcards";
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

  const fetchAllChats = useCallback(async () => {
    const url = "http://localhost:5000/get-all-chat";
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

  const fetchQuiz = useCallback(async () => {
    const url = "http://localhost:5000/get-quiz";
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
