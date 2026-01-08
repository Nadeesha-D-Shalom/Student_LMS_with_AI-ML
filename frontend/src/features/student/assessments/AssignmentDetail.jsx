import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const AssignmentDetail = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const status = useMemo(
    () => (data?.status || "").toUpperCase(),
    [data]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(
        `/api/student/assignments/${assignmentId}`
      );
      setData(res);
      setUrl(res?.submission_url || "");
    } catch (err) {
      setError(err.message || "Failed to load assignment");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!url.trim()) {
      setError("Please paste your submission URL.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await apiFetch(
        `/api/student/assignments/${assignmentId}/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            submission_url: url.trim()
          })
        }
      );
      await load();
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-24 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500">
              Assignment #{assignmentId}
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              {data?.title || "Assignment"}
            </h1>
            <p className="text-sm text-slate-600">
              Due: {(data?.due_date || "").toString().slice(0, 10)}{" "}
              {data?.due_time || ""} · Total:{" "}
              {data?.total_marks || 0} marks
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
            >
              Back
            </button>

            <button
              onClick={load}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Instructions */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            Instructions
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
            {data?.description || "No description provided."}
          </div>
        </div>

        {/* Submission */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Submission
            </div>
            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                status === "SUBMITTED"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              ].join(" ")}
            >
              {status === "SUBMITTED" ? "Submitted" : "Pending"}
            </span>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-slate-600">
              Submission URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
          </div>

          <button
            onClick={submit}
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {saving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetail;
