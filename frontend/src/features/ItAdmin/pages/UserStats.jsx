import React, { useMemo, useState } from "react";

const UserStats = () => {
  const [q, setQ] = useState("");

  const rows = useMemo(
    () => [
      { group: "Students", total: 1240, active: 1102, inactive: 138 },
      { group: "Teachers", total: 68, active: 63, inactive: 5 },
      { group: "Institute Admins", total: 5, active: 5, inactive: 0 },
      { group: "IT Admins", total: 2, active: 2, inactive: 0 }
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => r.group.toLowerCase().includes(s));
  }, [q, rows]);

  return (
    <div className="max-w-4xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">User Statistics</h2>
            <p className="mt-1 text-sm text-slate-500">High-level user health and activity.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Export CSV
            </button>
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Export PDF
            </button>
          </div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Search group (e.g., Students)"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="py-2 pr-4">Group</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2 pr-4">Inactive</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {filtered.map((r) => (
                <tr key={r.group} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold">{r.group}</td>
                  <td className="py-3 pr-4">{r.total}</td>
                  <td className="py-3 pr-4">{r.active}</td>
                  <td className="py-3 pr-4">{r.inactive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Backend integration: metrics endpoint and real exports.
        </div>
      </div>
    </div>
  );
};

export default UserStats;
