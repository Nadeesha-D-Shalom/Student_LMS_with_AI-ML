import React, { useMemo, useState } from "react";

const Notifications = () => {
  const [audience, setAudience] = useState("ALL");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const history = useMemo(
    () => [
      { id: 1, at: "2026-01-06 21:50", audience: "ALL", title: "Maintenance Notice" },
      { id: 2, at: "2026-01-05 08:10", audience: "STUDENTS", title: "Exam Week Support" }
    ],
    []
  );

  const canSend = title.trim() && body.trim();

  const send = () => {
    if (!canSend) return;
    console.log("Send notification:", { audience, title, body });
    setTitle("");
    setBody("");
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Send Notification</h2>
        <p className="mt-1 text-sm text-slate-500">Broadcast system notices to selected groups.</p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Users</option>
              <option value="STUDENTS">Students</option>
              <option value="TEACHERS">Teachers</option>
              <option value="ADMINS">Admins</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Short title"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
            rows={4}
            placeholder="Write the notification body..."
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={send}
            disabled={!canSend}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
          >
            Send Notification
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Send History</h3>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-4">Timestamp</th>
                <th className="py-2 pr-4">Audience</th>
                <th className="py-2 pr-4">Title</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {history.map((h) => (
                <tr key={h.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4">{h.at}</td>
                  <td className="py-3 pr-4">{h.audience}</td>
                  <td className="py-3 pr-4 font-semibold">{h.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Backend integration: delivery status, read receipts, retries.
        </div>
      </div>
    </div>
  );
};

export default Notifications;
