import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "../../../api/api";
import ThinkingDot from "./ThinkingDot";
import "./aiAssistant.css";

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const typeAIResponse = (text) => {
    const id = Date.now();
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
    }, 15);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }, 0);

    try {
      const data = await apiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage.content })
      });

      typeAIResponse(data.answer_markdown);
    } catch {
      typeAIResponse("Sorry, I could not generate a response right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const copyText = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="chat-root">
      <div className="chat-body">
        {messages.length === 0 && (
          <div className="chat-empty-wrapper">
            <div className="chat-empty">
              <h1>NexDS Intelligence</h1>
              <p>Your academic assistant. Ask questions clearly.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chat-row ${msg.role}`}>
            <div className="chat-bubble">
              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {msg.role === "ai" && (
                <button
                  className="copy-btn"
                  onClick={() => copyText(msg.content)}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-row ai">
            <div className="chat-bubble">
              <ThinkingDot />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <div className="chat-input">
          <textarea
            ref={textareaRef}
            placeholder="Ask NexDS AI Intelligence..."
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
            disabled={!input.trim() || loading}
          >
            ↑
          </button>
        </div>

        <div className="chat-disclaimer">
          NexDS AI Intelligence may make mistakes. Verify academic information.
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
