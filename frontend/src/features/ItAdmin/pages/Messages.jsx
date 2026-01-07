import React, { useMemo, useState } from "react";

const seedThreads = [
  {
    id: "t1",
    fromRole: "Student",
    fromName: "Student #1021",
    subject: "Login issue after password reset",
    lastMessageAt: "2026-01-07 21:12",
    unread: true,
    messages: [
      { by: "Student #1021", at: "2026-01-07 21:10", text: "I cannot login after reset." },
      { by: "System", at: "2026-01-07 21:11", text: "Password reset completed." }
    ]
  },
  {
    id: "t2",
    fromRole: "Teacher",
    fromName: "Teacher - Science",
    subject: "Video upload failing",
    lastMessageAt: "2026-01-07 18:05",
    unread: false,
    messages: [
      { by: "Teacher - Science", at: "2026-01-07 18:03", text: "Upload stops at 80%." }
    ]
  },
  {
    id: "t3",
    fromRole: "Institute Admin",
    fromName: "Admin - Main Branch",
    subject: "Need maintenance window tonight",
    lastMessageAt: "2026-01-07 15:40",
    unread: true,
    messages: [
      { by: "Admin - Main Branch", at: "2026-01-07 15:38", text: "Can you schedule downtime 10 PM?" }
    ]
  }
];

const roleBadgeClass = (role) => {
  const r = String(role).toLowerCase();
  if (r.includes("student")) return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (r.includes("teacher")) return "bg-amber-50 text-amber-700 border-amber-100";
  if (r.includes("admin")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  return "bg-slate-50 text-slate-700 border-slate-100";
};

const Messages = () => {
  const [q, setQ] = useState("");
  const [threads, setThreads] = useState(seedThreads);
  const [activeId, setActiveId] = useState(seedThreads[0]?.id || null);
  const [reply, setReply] = useState("");

  const active = useMemo(
    () => threads.find((t) => t.id === activeId) || null,
    [threads, activeId]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return threads;
    return threads.filter((t) => {
      return (
        t.subject.toLowerCase().includes(s) ||
        t.fromName.toLowerCase().includes(s) ||
        t.fromRole.toLowerCase().includes(s)
      );
    });
  }, [threads, q]);

  const openThread = (id) => {
    setActiveId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t))
    );
  };

  const sendReply = () => {
    const text = reply.trim();
    if (!text || !active) return;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== active.id) return t;
        const next = {
          ...t,
          lastMessageAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          messages: [...t.messages, { by: "IT Admin", at: "Now", text }]
        };
        return next;
      })
    );
    setReply("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left: Inbox */}
      <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Inbox</h2>
            <span className="text-xs text-slate-500">
              {threads.filter((t) => t.unread).length} unread
            </span>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search messages..."
            className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => openThread(t.id)}
              className={[
                "w-full text-left p-4 hover:bg-slate-50 transition",
                t.id === activeId ? "bg-slate-50" : "bg-white"
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(
                        t.fromRole
                      )}`}
                    >
                      {t.fromRole}
                    </span>
                    {t.unread ? (
                      <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
                    ) : null}
                  </div>

                  <div className="mt-2 font-semibold text-sm text-slate-900 truncate">
                    {t.subject}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 truncate">
                    {t.fromName}
                  </div>
                </div>

                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {t.lastMessageAt}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Conversation */}
      <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {!active ? (
          <div className="p-6 text-sm text-slate-500">Select a conversation.</div>
        ) : (
          <>
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {active.subject}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    From: {active.fromName} ({active.fromRole})
                  </div>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {active.lastMessageAt}
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[55vh] overflow-auto">
              {active.messages.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{m.by}</span>
                    <span>{m.at}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
                  rows={2}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim()}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
                >
                  Send
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Backend integration: load threads, mark read, reply, assign ticket.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
