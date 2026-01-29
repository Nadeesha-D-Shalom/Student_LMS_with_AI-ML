import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../api/api";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const cls = map[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};

/* ================= INBOX ================= */
export default function TeacherMessageInbox() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- LOAD FUNCTION ---------- */
  const load = useCallback(async (search = "") => {
    setError("");
    try {
      const res = await apiFetch(
        `/api/teacher/messages${search ? `?q=${encodeURIComponent(search)}` : ""}`
      );
      setItems(res.items || []);
    } catch {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    setLoading(true);
    load("");
  }, [load]);

  /* ---------- SEARCH DEBOUNCE ---------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      load(q.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [q, load]);

  /* ---------- AUTO REFRESH (LIVE) ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      load(q.trim());
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [q, load]);

  const hasItems = useMemo(() => items.length > 0, [items]);

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto h-full max-w-6xl px-6 py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Student inquiries and replies (email-style).
          </p>
        </div>

        <div className="w-full max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by subject or student name"
            className="w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-white">
        <div className="border-b px-5 py-3 text-sm font-semibold text-slate-700">
          Inbox
        </div>

        {loading && (
          <div className="p-5 text-sm text-slate-500">Loading...</div>
        )}

        {!loading && error && (
          <div className="p-5 text-sm text-red-700">
            {error}
            <button
              onClick={() => load(q.trim())}
              className="ml-3 rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && !hasItems && (
          <div className="p-10 text-center text-sm text-slate-500">
            No messages found.
          </div>
        )}

        {!loading && !error && hasItems && (
          <div className="divide-y">
            {items.map((m) => {
              const unread = (m.unread_count || 0) > 0;

              return (
                <button
                  key={m.thread_id}
                  onClick={() => navigate(`/teacher/messages/${m.thread_id}`)}
                  className={`w-full px-5 py-4 text-left transition hover:bg-slate-50 ${
                    unread ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`truncate ${
                            unread
                              ? "font-semibold text-slate-900"
                              : "font-medium text-slate-900"
                          }`}
                        >
                          {m.subject}
                        </div>

                        {unread && (
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                            {m.unread_count} new
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                        <span className={unread ? "font-semibold" : ""}>
                          {m.student_name || "Student"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>{m.student_class || "Class"}</span>
                        <span className="text-slate-300">•</span>
                        <span className="truncate">{m.last_message || ""}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={m.status} />
                      <div className="text-xs text-slate-500">
                        {m.last_message_at
                          ? new Date(m.last_message_at).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
