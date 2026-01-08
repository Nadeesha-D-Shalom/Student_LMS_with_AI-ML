import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const StatusBadge = ({ status }) => {
  const s = (status || "").toUpperCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        s === "SUBMITTED"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {s === "SUBMITTED" ? "Submitted" : "Pending"}
    </span>
  );
};

const Assignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/student/assignments");
        setAssignments(res?.items || []);
      } catch (err) {
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openAssignment = (a) => {
    navigate(
      `/student/classes/${a.class_id}/grade/${a.grade_id || 4}/assignments/${a.id}`
    );
  };

  if (loading) {
    return <div className="p-6 text-sm">Loading assignments...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-5">
        <h1 className="text-lg font-semibold">Assignments</h1>
        <p className="text-sm text-slate-600">
          View all assignments assigned to your classes
        </p>
      </div>

      {/* List */}
      {assignments.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-slate-500">
          No assignments available
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold">
                  {a.title}
                </div>
                <div className="text-xs text-slate-600">
                  {a.class_name}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={a.status} />

                <button
                  onClick={() => openAssignment(a)}
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

export default Assignments;
