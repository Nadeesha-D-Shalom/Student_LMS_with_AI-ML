import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";

export default function MessageThread() {
  const { messageId } = useParams();

  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/student/messages/${messageId}`);
      setThread(res.thread);
      setMessages(res.messages || []);
    } catch {
      setError("Failed to load message thread");
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  useEffect(() => {
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim()) return;

    setSending(true);
    try {
      await apiFetch(`/api/student/messages/${messageId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: reply.trim() }),
      });
      setReply("");
      await load();
    } catch {
      setError("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!thread) return <div className="p-6">Thread not found</div>;

  const isClosed = thread.status === "COMPLETED";

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-4xl flex-col rounded-2xl border bg-white">
      <div className="border-b px-6 py-4">
        <h1 className="text-sm font-semibold">{thread.subject}</h1>
        {isClosed && (
          <p className="text-xs font-semibold text-red-600">
            Conversation closed by teacher
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
        {[...messages].reverse().map((m) => (
          <div key={m.id} className={`flex ${m.sender_role === "STUDENT" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
              m.sender_role === "STUDENT" ? "bg-blue-700 text-white" : "bg-slate-100"
            }`}>
              {m.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t px-4 py-3">
        <textarea
          disabled={isClosed}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="w-full rounded-xl border px-4 py-2"
          placeholder={isClosed ? "Conversation closed" : "Write your reply..."}
        />
        <button
          disabled={sending || isClosed}
          onClick={sendReply}
          className="mt-2 rounded-xl bg-blue-800 px-5 py-2 text-white "
        >
          Send
        </button>
      </div>
    </div>
  );
}
