import React, { useMemo, useState } from "react";

const SystemUpdates = () => {
  const [title, setTitle] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [message, setMessage] = useState("");

  const history = useMemo(
    () => [
      { id: 1, title: "Patch v0.7.20", start: "2026-01-06 22:00", end: "2026-01-06 22:10", status: "Completed" },
      { id: 2, title: "Database Maintenance", start: "2026-01-05 01:00", end: "2026-01-05 01:30", status: "Completed" }
    ],
    []
  );

  const canSubmit = title.trim() && windowStart && windowEnd && message.trim();

  const submit = () => {
    if (!canSubmit) return;
    console.log("Schedule Update:", { title, windowStart, windowEnd, message });
    setTitle("");
    setWindowStart("");
    setWindowEnd("");
    setMessage("");
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Schedule System Update</h2>
        <p className="mt-1 text-sm text-slate-500">
          Notify all users about maintenance windows and planned updates.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g., Patch v0.7.21"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Update Message</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Short notice message"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Window Start</label>
            <input
              type="datetime-local"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Window End</label>
            <input
              type="datetime-local"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
          >
            Schedule & Notify
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Update History</h3>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">End</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {history.map((h) => (
                <tr key={h.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold">{h.title}</td>
                  <td className="py-3 pr-4">{h.start}</td>
                  <td className="py-3 pr-4">{h.end}</td>
                  <td className="py-3 pr-4">{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Backend integration: store schedules, broadcast notices, add status updates.
        </div>
      </div>
    </div>
  );
};

export default SystemUpdates;
