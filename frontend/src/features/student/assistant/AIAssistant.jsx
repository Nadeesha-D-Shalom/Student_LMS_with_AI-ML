import React, { useState, useEffect, useRef } from "react";
import "./aiAssistant.css";

const STORAGE_KEY = "lms_ai_chat_history";

const DEFAULT_MESSAGE = [
  {
    role: "assistant",
    content: "Hello. I am your AI Learning Assistant. Ask me anything."
  }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(DEFAULT_MESSAGE);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "This is a placeholder response. AI logic will be connected later."
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages(DEFAULT_MESSAGE);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  const isEmptyChat =
    messages.length === 1 && messages[0].role === "assistant";

  return (
    <div className="ai-page">
      {/* Header */}
      <div className="ai-header">
        <h2>AI Learning Assistant</h2>
        <button className="new-chat-btn" onClick={handleNewChat}>
          New Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="ai-chat">
        <div className="ai-chat-inner">
          {isEmptyChat ? (
            <div className="ai-welcome">
              <h1>Ready when you are.</h1>
              <p>
                Ask questions about subjects, lessons, assignments, or exam
                preparation.
              </p>
              <p className="ai-hint">
                Press <strong>Enter</strong> to send •{" "}
                <strong>Shift + Enter</strong> for new line
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`ai-message-row ${msg.role}`}
                >
                  <div className="ai-message-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="ai-message-row assistant">
                  <div className="ai-message-bubble typing">
                    Typing…
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="ai-input-bar">
        <div className="ai-input-container">
          <textarea
            ref={textareaRef}
            placeholder="Ask anything…"
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
