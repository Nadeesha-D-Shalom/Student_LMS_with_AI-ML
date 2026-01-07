import React, { useMemo, useState } from "react";

const AuditLogs = () => {
  const [q, setQ] = useState("");

  const logs = useMemo(
    () => [
      { id: 1, at: "2026-01-07 21:05", actor: "IT Admin 01", action: "SYSTEM_LOCK", meta: "Reason: Maintenance" },
      { id: 2, at: "2026-01-07 21:20", actor: "IT Admin 01", action: "SYSTEM_UNLOCK", meta: "Reason: Completed" },
      { id: 3, at: "2026-01-06 22:00", actor: "IT Admin 02", action: "UPDATE_SCHEDULED", meta: "Patch v0.7.20" }
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return logs;
    return logs.filter((l) => {
      return (
        l.actor.toLowerCase().includes(s) ||
        l.action.toLowerCase().includes(s) ||
        l.meta.toLowerCase().includes(s)
      );
    });
  }, [q, logs]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Audit Logs</h2>
            <p className="mt-1 text-sm text-slate-500">Track critical system events and admin actions.</p>
          </div>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Export
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Search actor, action, metadata"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4">Timestamp</th>
              <th className="py-2 pr-4">Actor</th>
              <th className="py-2 pr-4">Action</th>
              <th className="py-2 pr-4">Details</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="py-3 pr-4">{l.at}</td>
                <td className="py-3 pr-4 font-semibold">{l.actor}</td>
                <td className="py-3 pr-4">{l.action}</td>
                <td className="py-3 pr-4">{l.meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-xs text-slate-500">
          Backend integration: pagination, filters (date range), event types, exports.
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
