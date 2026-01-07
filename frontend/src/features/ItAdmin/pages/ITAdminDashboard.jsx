import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import SystemStatusBadge from "../components/SystemStatusBadge";

const ITAdminDashboard = () => {
  const navigate = useNavigate();

  // Replace with API later
  const data = useMemo(
    () => ({
      systemStatus: "ONLINE",
      lastUpdate: "2026-01-06 22:00",
      students: 1240,
      teachers: 68,
      admins: 5,
      activeSessions: 132
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">
                System Overview
              </h2>
              <SystemStatusBadge status={data.systemStatus} />
            </div>
            <p className="text-sm text-slate-500">
              Monitor system health and platform usage at a glance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => navigate("/it-admin/audit-logs")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              View Audit Logs
            </button>

            <button
              type="button"
              onClick={() => navigate("/it-admin/notifications")}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Create System Notice
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Last System Update</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {data.lastUpdate}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <div className="text-xs text-slate-500">Active Sessions</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {data.activeSessions}
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={data.students} />
        <StatCard label="Total Teachers" value={data.teachers} />
        <StatCard label="Total Admins" value={data.admins} />
        <StatCard label="Active Sessions" value={data.activeSessions} />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* System Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold">System Controls</h3>
          <p className="mt-1 text-sm text-slate-500">
            Lock/unlock LMS access and maintenance actions.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigate("/it-admin/system-lock")}
              className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500 transition"
            >
              Lock System
            </button>

            <button
              onClick={() => navigate("/it-admin/system-lock")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Maintenance Mode
            </button>
          </div>
        </div>

        {/* Updates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Updates</h3>
          <p className="mt-1 text-sm text-slate-500">
            Schedule update windows and notify users.
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/it-admin/system-updates")}
              className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Schedule Update
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Security</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review audit logs and security events.
          </p>
          <div className="mt-4">
            <button
              onClick={() => navigate("/it-admin/audit-logs")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Open Security Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITAdminDashboard;
