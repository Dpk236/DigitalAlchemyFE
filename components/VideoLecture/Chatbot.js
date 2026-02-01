import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Typography, Space, Divider } from "antd";
import { SendOutlined, MessageOutlined } from "@ant-design/icons";
import { socket } from "./socket";
import MarkdownWithTimestamps from "../CommonComponents/MarkdownWithTimestamps";
import useChatbot from "./useChatbot";
import LectureAssistantHeader from "./components/LectureAssistantHeader";
import AIAnalyzingHeader from "./components/AIAnalyzingHeader";
const { Text } = Typography;
const { TextArea } = Input;

const PRIMARY = "#008dc4";
const LIGHT_BG = "#e6f6fb";
const DARK_BG_USER = "#1f2937"; // gray-800
const DARK_BG_ASSISTANT = "#111827"; // gray-900

const QUICK_QUESTIONS = [
  "I have a doubt at 07:12",
  "Give quiz",
  "Get notes for this lecture",
];

const Chat = ({ toggle, isDarkMode }) => {
  const { chatMessages } = useChatbot();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const typingIntervalRef = useRef(null);
  const bottomRef = useRef(null);

  const userId = "user123";
  const lectureId = "lecture456";
  const sessionId = "session789";

  /* 🔹 Stream assistant response word-by-word */
  const streamAssistantResponse = (fullText, type, crossQuestions = []) => {
    const words = fullText.split(" ");
    let index = 0;

    setMessages((prev) => [
      ...prev.filter((m) => m.role !== "typing"),
      {
        role: "assistant",
        text: "",
        type: type,
        cross_questions: crossQuestions,
      },
    ]);

    typingIntervalRef.current = setInterval(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (index < words.length) {
          last.text += (index === 0 ? "" : " ") + words[index++];
        } else {
          clearInterval(typingIntervalRef.current);
          setIsThinking(false);
        }
        return updated;
      });
    }, 35);
  };

  useEffect(() => {
    socket.on("chat_response", (res) => {
      const response = JSON.parse(res);
      const { type, ai_response, data } = response || {};
      const { cross_questions } = data || {};
      console.log("Received chat_response:", response, typeof res);
      if (type == "clarification") {
        streamAssistantResponse(ai_response, type, cross_questions || []);
      } else {
        streamAssistantResponse(ai_response, type);
      }
    });

    return () => {
      socket.off("chat_response");
      clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!chatMessages.length) return;
    console.log("chatMessageschatMessages", chatMessages);
    setMessages(
      chatMessages.map((item) => ({
        role: item?.role,
        text: item?.content,
        type: item?.type,
        cross_questions: item?.cross_questions,
      }))
    );
  }, [chatMessages]);

  const sendMessage = (text) => {
    const finalMessage = text ?? message;
    if (!finalMessage.trim() || isThinking) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: finalMessage },
      { role: "typing", text: "Assistant is thinking..." },
    ]);

    setIsThinking(true);
    socket.emit("chat_message", {
      user_id: userId,
      lecture_id: lectureId,
      session_id: sessionId,
      message: finalMessage,
    });

    setMessage("");
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (isThinking) return;
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isThinking]);
  const handleDownload = (html) => {
    try {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(html);
        newWindow.document.close();
        newWindow.print();
      }
    } catch (error) {
      console.error("Failed to load HTML preview:", error);
    }
  };
  const onSeek = (time) => {
    const parts = time.split(":").map(Number);

    let seconds = 0;

    if (parts.length === 2) {
      // mm:ss
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // hh:mm:ss
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    const video = document.querySelector('video'); // Use querySelector instead of ID
    if (!video) return;

    video.currentTime = seconds;
    video.play();
  };

  console.log("messagesmessages", messages);

  const containerBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  // const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div
      style={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
      }}
      className={containerBg}
    >
      <LectureAssistantHeader isDarkMode={isDarkMode} />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          height: "calc(90vh - 100px)",
        }}
        className={isDarkMode ? "bg-gray-900" : "bg-white"}
      >
        {messages.length === 0 ? (
          <div
            style={{
              padding: "12px",
              color: isDarkMode ? "#bbb" : "#555",
            }}
          >
            <Text type="secondary" style={{ color: isDarkMode ? "#888" : undefined }}>Try one of these:</Text>

            <div
              style={{
                display: "flex",
                marginTop: 12,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {QUICK_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  size="small"
                  style={{
                    margin: 4,
                    borderColor: PRIMARY,
                    color: PRIMARY,
                    background: isDarkMode ? "#1f2937" : "#fff",
                  }}
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <List
            dataSource={messages}
            renderItem={(item) => {
              if (item.role === "typing") {
                return (
                  <List.Item style={{ borderBlockEnd: 'none' }}>
                    <AIAnalyzingHeader isDarkMode={isDarkMode} />
                  </List.Item>
                );
              }

              const isUser = item.role === "user";

              return (
                <List.Item
                  style={{
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    borderBlockEnd: 'none'
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: isUser ? (isDarkMode ? PRIMARY : LIGHT_BG) : (isDarkMode ? DARK_BG_USER : "#fcfcfc"),
                      border: isUser
                        ? `1px solid ${PRIMARY}`
                        : `1px solid ${isDarkMode ? "#374151" : "#eee"}`,
                      color: isUser ? (isDarkMode ? "#fff" : "inherit") : (isDarkMode ? "#e5e7eb" : "inherit"),
                    }}
                  >
                    <Text strong style={{ color: isUser ? (isDarkMode ? "#fff" : PRIMARY) : (isDarkMode ? "#fff" : "#333") }}>
                      {isUser ? "You" : "Assistant"}
                    </Text>
                    {item["type"] === "notes_creation" && (
                      <Button
                        onClick={() => {
                          handleDownload(item.text);
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        Download PDF
                      </Button>
                    )}
                    {isUser ? (
                      <div
                        className="html-content"
                        style={{ marginTop: 6 }}
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    ) : (
                      <MarkdownWithTimestamps
                        content={item.text || ""}
                        onSeek={onSeek}
                        isDarkMode={isDarkMode}
                      />
                    )}
                    {item.role === "assistant" &&
                      item.cross_questions?.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {item.cross_questions.map((q, i) => (
                            <Button
                              key={i}
                              type="link"
                              style={{ padding: 0, color: PRIMARY }}
                              onClick={() => sendMessage(q)}
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      )}
                  </div>
                </List.Item>
              );
            }}
          />
        )}

        <div ref={bottomRef} />
      </div>
      <div
        style={{
          padding: 12,
          borderTop: `1px solid ${isDarkMode ? "#374151" : "#eee"}`,
          background: isDarkMode ? "#1f2937" : "#fff",
        }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <TextArea
            value={message}
            placeholder="Ask a doubt..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isThinking}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            style={{
              background: isDarkMode ? "#374151" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "#4b5563" : "#d9d9d9",
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => sendMessage()}
            disabled={isThinking}
            style={{ background: PRIMARY }}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default Chat;
