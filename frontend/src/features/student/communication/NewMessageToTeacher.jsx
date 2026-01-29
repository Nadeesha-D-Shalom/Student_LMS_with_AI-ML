import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function NewMessageToTeacher() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeachers = async () => {
      setLoadingTeachers(true);
      setError("");
      try {
        // You must expose an endpoint that lists teachers for student selection.
        // Example endpoint: GET /api/student/teachers
        const res = await apiFetch("/api/student/teachers");
        setTeachers(res.items || []);
      } catch (e) {
        setError("Failed to load teachers");
      } finally {
        setLoadingTeachers(false);
      }
    };
    loadTeachers();
  }, []);

  const onSend = async () => {
    setError("");
    if (!teacherId || !subject.trim() || !message.trim()) {
      setError("Teacher, subject, and message are required");
      return;
    }

    setSending(true);
    try {
      const res = await apiFetch("/api/student/messages", {
        method: "POST",
        body: JSON.stringify({
          teacher_id: Number(teacherId),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const threadId = res.thread_id;
      window.dispatchEvent(new Event("messages-updated"));
      navigate(`/student/messages/${threadId}`);
    } catch (e) {
      setError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-900">New Message</h1>
        <p className="mt-1 text-sm text-slate-500">
          Send a message to a teacher (email-style thread).
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">Teacher</label>
          <div className="mt-2">
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              disabled={loadingTeachers}
            >
              <option value="">{loadingTeachers ? "Loading teachers..." : "Select a teacher"}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 w-full rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Example: Question about Week 04 assignment"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 min-h-[140px] w-full resize-none rounded-xl border bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="Write your message..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onSend}
            disabled={sending}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
