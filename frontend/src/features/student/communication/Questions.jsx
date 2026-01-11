import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Questions = () => {
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [teacherId, setTeacherId] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await apiFetch("/api/student/classes");
      setClasses(res.items || []);
    } catch {
      setError("Failed to load teacher list");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    setError("");
    setSuccess("");

    if (!type) {
      setError("Please select a question category.");
      return;
    }

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (type === "SUBJECT" && !teacherId) {
      setError("Please select a subject teacher.");
      return;
    }

    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/api/student/messages", {
        method: "POST",
        body: JSON.stringify({
          type,
          subject: subject.trim(),
          teacher_id: type === "SUBJECT" ? Number(teacherId) : null,
          message: message.trim()
        })
      });

      setSuccess("Your message has been sent successfully.");
      setSubject("");
      setMessage("");
      setTeacherId("");
      setType("");
    } catch (e) {
      setError(e.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-blue-100 bg-white p-6">
        <h1 className="text-lg font-semibold text-slate-900">
          Ask a Question
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Contact IT support, institute administration, or subject teachers.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">

        {/* Question Type */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Question Category
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (!subject) {
                setSubject(
                  e.target.value === "IT"
                    ? "Technical Issue"
                    : e.target.value === "INSTITUTE"
                    ? "Institute Inquiry"
                    : ""
                );
              }
            }}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select category</option>
            <option value="IT">IT / Technical Issue</option>
            <option value="INSTITUTE">Institute / Administration</option>
            <option value="SUBJECT">Subject / Teacher Question</option>
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter a short subject"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Teacher Selector */}
        {type === "SUBJECT" && (
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Subject Teacher
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select teacher</option>
              {classes.map((c) => (
                <option key={c.class_id} value={c.teacher_id}>
                  {c.subject_name} — {c.teacher_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Your Message
          </label>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question clearly..."
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={sendMessage}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Questions;
