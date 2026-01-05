import React, { useState, useRef, useEffect } from "react";
import "./aiAssistant.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }, 0);

    setTimeout(() => {
      typeAIResponse(
        "This is a simulated AI response with typing effect. Backend integration will be added later."
      );
    }, 500);
  };

  const typeAIResponse = (text) => {
    const id = Date.now() + 1;
    let index = 0;

    setMessages((prev) => [...prev, { id, role: "ai", content: "" }]);

    const interval = setInterval(() => {
      index++;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, content: text.slice(0, index) }
            : msg
        )
      );

      if (index >= text.length) clearInterval(interval);
    }, 18);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chat-root">
      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty-wrapper">
            <div className="chat-empty">
              <h1>NexDS AI</h1>
              <p>Your academic assistant. Ask questions clearly and precisely.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chat-row ${msg.role}`}>
            <div className="chat-bubble">
              <span>{msg.content}</span>

              {msg.role === "ai" && (
                <button
                  className="copy-btn"
                  onClick={() => copyText(msg.content)}
                  title="Copy response"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="chat-input-wrapper">
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            placeholder="Ask NexDS AI anything about your studies"
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className="send-icon-btn"
            onClick={sendMessage}
            disabled={!input.trim()}
            aria-label="Send"
          >
            ↑
          </button>
        </div>

        {/* DISCLAIMER */}
        <div className="chat-disclaimer">
          NexDS AI can make mistakes. Always verify important academic information.
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
