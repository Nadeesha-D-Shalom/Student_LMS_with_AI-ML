import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../api/api";
import "./results.css";

const passPercentage = 40;

const ResultBadge = ({ percentage }) => {
  const pass = percentage >= passPercentage;

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        pass
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {pass ? "PASS" : "FAIL"}
    </span>
  );
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("ALL");
  const [test, setTest] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/student/results");
        setResults(res.items || []);
      } catch {
        setError("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subjects = useMemo(() => {
    return ["ALL", ...new Set(results.map(r => r.subject))];
  }, [results]);

  const tests = useMemo(() => {
    return [
      "ALL",
      ...new Set(
        results
          .filter(r => subject === "ALL" || r.subject === subject)
          .map(r => r.title)
      )
    ];
  }, [results, subject]);

  const filtered = results.filter(r => {
    return (
      (subject === "ALL" || r.subject === subject) &&
      (test === "ALL" || r.title === test)
    );
  });

  if (loading) {
    return <div className="page-loading">Loading results...</div>;
  }

  if (error) {
    return <div className="page-error">{error}</div>;
  }

  return (
    <div className="results-page space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-lg font-semibold">Results</h1>
        <p className="text-sm text-slate-600">
          View your test performance and scores
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          {subjects.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={test}
          onChange={(e) => setTest(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          {tests.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-slate-500">
          No results available
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => {
            const percentage = Math.round(
              (r.score / r.total_marks) * 100
            );

            return (
              <div
                key={r.id}
                className="rounded-2xl border bg-white p-5 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold">
                    {r.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    {r.subject} · Submitted on{" "}
                    {r.submitted_at?.slice(0, 10)}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {r.score} / {r.total_marks}
                    </div>
                    <div className="text-xs text-slate-500">
                      {percentage}%
                    </div>
                  </div>

                  <ResultBadge percentage={percentage} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Results;
