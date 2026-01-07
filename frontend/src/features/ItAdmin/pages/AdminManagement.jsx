import React, { useMemo, useState } from "react";

const AdminManagement = () => {
  const [q, setQ] = useState("");

  const admins = useMemo(
    () => [
      { id: 1, name: "IT Admin 01", email: "itadmin01@lms.com", role: "IT Admin", status: "Active" },
      { id: 2, name: "IT Admin 02", email: "itadmin02@lms.com", role: "IT Admin", status: "Active" },
      { id: 3, name: "Institute Admin", email: "admin@lms.com", role: "Institute Admin", status: "Active" }
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return admins;
    return admins.filter((a) => a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s));
  }, [q, admins]);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Admin Management</h2>
            <p className="mt-1 text-sm text-slate-500">Manage admin roles and security actions.</p>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Add Admin
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          placeholder="Search admin by name or email"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-semibold">{a.name}</td>
                <td className="py-3 pr-4">{a.email}</td>
                <td className="py-3 pr-4">{a.role}</td>
                <td className="py-3 pr-4">{a.status}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                      Reset Password
                    </button>
                    <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                      Change Role
                    </button>
                    <button className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 text-xs text-slate-500">
          Backend integration: RBAC, reset flows, and audit logging.
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
