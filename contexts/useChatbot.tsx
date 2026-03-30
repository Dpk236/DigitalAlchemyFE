import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
import { useLocation } from "react-router-dom";
import { STREAM_DATA } from "@/services/streamConstants";

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
const baseUrl = "https://d3vo8rtp78h2dc.cloudfront.net";

const useChatbot = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoId = queryParams.get('video_id');
  const activeStream = queryParams.get('stream');
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
  const currentStreamData = useMemo(() => (STREAM_DATA[activeStream] || []).map((ele: any) => [...ele.syllabus_master_videos]).flatMap((ele: any) => ele), [activeStream]);
  const path = currentStreamData.find((ele: any) => ele.asset_id === videoId)?.video_link;
  console.log("currentStreamDatacurrentStreamData", currentStreamData);
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
  function getAllData(videoPath: string) {
    if (!videoPath) return "";
    // 1. Split the path into parts
    const parts = videoPath.split('/');

    // 2. Remove the last part (the filename)
    const fileNameWithExt = parts.pop() || "";

    // 3. Remove the extension (.mp4) and prepare the transcript filename
    const fileName = fileNameWithExt.replace('.mp4', '');
    const transcriptFileName = `${fileName}_summary.json`;

    // 4. Rebuild the path with "transcripts" inserted
    const transcriptPath = [
      ...parts,
      'transcripts',
      encodeURIComponent(transcriptFileName)
    ].join('/');

    return `${baseUrl}/${transcriptPath}`;
  }




  const lastFetchedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!path || !videoId) return;
    const url = getAllData(path);
    
    // Prevent redundant or infinite calls
    if (lastFetchedUrl.current === url) return;
    
    console.log("Fetching all lecture data from:", url);
    lastFetchedUrl.current = url;
    setLoading(true);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Lecture data not found");
        return res.json();
      })
      .then(data => {
        if (data) {
          setSummaryHtml(data.summary || null);
          setMindMapData(data.mindmap || null);
          setQuiz({
            data: data.quizzes || [],
            title: data.lecture_topic || "Quiz"
          });
          setAiFlashCardsContent(data.flashcards || []);
          console.log("Successfully loaded lecture data for:", videoId);
        }
      })
      .catch(err => {
        console.error("Failed to fetch lecture data:", err);
        // Fallback or clear states on failure
        setSummaryHtml(null);
        setMindMapData(null);
        setQuiz({});
        setAiFlashCardsContent([]);
        lastFetchedUrl.current = null; // Allow retry on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path, videoId]);


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

  const fetchSummary = useCallback(async (vid?: string) => {
    // Already handled by useEffect for current video
    if ((vid || videoId) === videoId && summaryHtml) return;
    
    try {
      const targetVid = vid || videoId;
      if (!targetVid) return;
      const batchResults = BatchResponse?.results?.results?.[targetVid];
      if (batchResults?.data?.summary) {
        setSummaryHtml(batchResults.data.summary);
      }
    } catch (err) {
      console.warn("Batch lookup failed", err);
    }
  }, [videoId, summaryHtml]);


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

  const fetchAIFlashCards = useCallback(async (vid?: string) => {
    if ((vid || videoId) === videoId && aiFlashCardsContent.length > 0) return;

    try {
      const targetVid = vid || videoId;
      if (!targetVid) return;
      const batchResults = BatchResponse?.results?.results?.[targetVid];
      if (batchResults?.data?.flashcards) {
        setAiFlashCardsContent(batchResults.data.flashcards);
      }
    } catch (err) {
      console.warn("Batch flashcards lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, [videoId, aiFlashCardsContent]);


  const fetchMindMap = useCallback(async (vid?: string) => {
    if ((vid || videoId) === videoId && mindMapData) return;

    try {
      const targetVid = vid || videoId;
      if (!targetVid) return;
      const batchResults = BatchResponse?.results?.results?.[targetVid];
      if (batchResults?.data?.mindmap) {
        setMindMapData(batchResults.data.mindmap);
      }
    } catch (err) {
      console.warn("Batch mindmap lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, [videoId, mindMapData]);


  const fetchAllChats = useCallback(
    async (
      vid?: string,
      userId: string = "user123",
      sessionId: string = "session789"
    ) => {
      const targetVid = vid || videoId;
      const url = `${BACKEND_URL}/get-all-chat?video_id=${targetVid || "waves"
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
    [videoId]
  );

  const fetchQuiz = useCallback(async (vid?: string) => {
    if ((vid || videoId) === videoId && quiz.data?.length > 0) return;

    try {
      const targetVid = vid || videoId;
      if (!targetVid) return;
      const batchResults = BatchResponse?.results?.results?.[targetVid];
      if (batchResults?.data?.quizzes) {
        setQuiz({ data: batchResults.data.quizzes });
      }
    } catch (err) {
      console.warn("Batch quiz lookup failed", err);
    } finally {
      setLoading(false);
    }
  }, [videoId, quiz]);



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
