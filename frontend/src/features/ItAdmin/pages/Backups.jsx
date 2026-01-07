import React, { useMemo, useState } from "react";

const Backups = () => {
  const [loading, setLoading] = useState(false);

  const backups = useMemo(
    () => [
      { id: 1, at: "2026-01-07 02:00", type: "Automatic", status: "Success" },
      { id: 2, at: "2026-01-06 02:00", type: "Automatic", status: "Success" }
    ],
    []
  );

  const trigger = async () => {
    setLoading(true);
    try {
      console.log("Trigger backup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Backups</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage backup operations and recovery history.
            </p>
          </div>
          <button
            onClick={trigger}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
          >
            {loading ? "Starting..." : "Trigger Backup"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-auto">
        <h3 className="text-sm font-semibold text-slate-900">Backup History</h3>
        <table className="mt-4 min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4">Timestamp</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {backups.map((b) => (
              <tr key={b.id} className="border-b border-slate-100">
                <td className="py-3 pr-4">{b.at}</td>
                <td className="py-3 pr-4">{b.type}</td>
                <td className="py-3 pr-4">{b.status}</td>
                <td className="py-3 pr-4">
                  <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 text-xs text-slate-500">
          Backend integration: restore flows and secure access control.
        </div>
      </div>
    </div>
  );
};

export default Backups;
