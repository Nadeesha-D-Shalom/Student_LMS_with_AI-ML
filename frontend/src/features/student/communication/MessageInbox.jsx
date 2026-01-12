import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";
import { useNavigate } from "react-router-dom";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  if (status === "PENDING") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
        Pending
      </span>
    );
  }

  if (status === "REPLIED") {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        Replied
      </span>
    );
  }

  return (
    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
      Seen
    </span>
  );
};

/* ================= MESSAGE INBOX ================= */
const MessageInbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInbox = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/student/messages");
      setMessages(res.items || []);
    } catch (err) {
      console.error("Inbox load failed:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();

    const refresh = () => loadInbox();
    window.addEventListener("messages-updated", refresh);

    return () => window.removeEventListener("messages-updated", refresh);
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
        <button
          onClick={loadInbox}
          className="ml-4 rounded bg-red-600 px-3 py-1 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-center text-slate-500">
        No messages yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          onClick={() => navigate(`/student/messages/${m.id}`)}
          className={`cursor-pointer rounded-xl border p-4 transition hover:shadow-sm ${
            m.status === "PENDING" ? "bg-blue-50" : "bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-semibold text-slate-900">
                {m.subject}
              </div>
              <div className="mt-1 truncate text-sm text-slate-600">
                {m.last_message}
              </div>
            </div>

            <StatusBadge status={m.status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageInbox;
