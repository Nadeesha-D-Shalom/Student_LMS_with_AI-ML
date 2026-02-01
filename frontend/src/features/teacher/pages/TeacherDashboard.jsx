import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";
import { NavLink } from "react-router-dom";

const formatDate = (v) => {
  if (!v) return "-";
  const iso = v.replace(" ", "T") + "Z";
  return new Date(iso).toLocaleString();
};

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/api/teacher/dashboard").then(setData);
  }, []);

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6 space-y-8 bg-slate-50">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">
          Quick summary of your teaching activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Total Classes" value={data.total_classes} />
        <Stat label="Total Students" value={data.total_students} />
        <Stat label="Active Assignments" value={data.active_assignments} />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Action to="/teacher/classes" title="My Classes" />
          <Action to="/teacher/content" title="Publish Material" />
          <Action to="/teacher/assignments" title="Create Assignment" />
          <Action to="/teacher/notices" title="Publish Notice" />
        </div>
      </div>

      {/* PUBLISHED NOTICES */}
      <div>
        <h2 className="text-lg font-semibold text-blue-700 mb-3">
          Published Notices
        </h2>

        {data.recent_notices.length === 0 && (
          <div className="rounded-xl border bg-white p-6 text-sm text-slate-500">
            No notices published yet
          </div>
        )}

        <div className="space-y-4">
          {data.recent_notices.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-slate-900">
                  {n.title || "Announcement"}
                </h3>

                <span className="text-xs text-slate-500">
                  {formatDate(n.published_at)}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">
                {n.content}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Audience:</span>{" "}
                  {n.target_role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-bold text-blue-700">{value}</div>
  </div>
);

const Action = ({ to, title }) => (
  <NavLink
    to={to}
    className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition"
  >
    <div className="font-semibold text-blue-700">{title}</div>
    <div className="mt-1 text-xs text-slate-600">
      Manage {title.toLowerCase()}
    </div>
  </NavLink>
);
