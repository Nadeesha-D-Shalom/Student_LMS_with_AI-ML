import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();

  const map = {
    NOT_STARTED: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    SUBMITTED: "bg-emerald-100 text-emerald-700",
    EXPIRED: "bg-rose-100 text-rose-700"
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        map[s] || "bg-slate-100 text-slate-700"
      }`}
    >
      {s.replace("_", " ")}
    </span>
  );
};

const Tests = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/student/tests");
        setTests(res?.items || []);
      } catch {
        setError("Failed to load tests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openTest = (test) => {
    navigate(`/student/tests/${test.id}`);
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading tests...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-lg font-semibold">Online Tests</h1>
        <p className="text-sm text-slate-600">
          Attempt MCQ tests within the given time window.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-slate-500">
          No tests available
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="text-xs text-slate-600">
                  Duration: {t.duration_minutes} mins · Total Marks: {t.total_marks}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={t.attempt_status} />

                <button
                  onClick={() => openTest(t)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tests;
