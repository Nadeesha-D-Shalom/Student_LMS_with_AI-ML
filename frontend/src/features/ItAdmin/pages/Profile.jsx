import React, { useState } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "Nadeesha D Shalom",
    email: "itadmin@lms.com",
    phone: "+94 7X XXX XXXX",
    role: "IT Admin"
  });

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    console.log("UPDATE PROFILE:", form);
  };

  const changePassword = () => {
    if (!password.current || !password.next || !password.confirm) return;
    if (password.next !== password.confirm) return;

    console.log("CHANGE PASSWORD:", password);
    setPassword({ current: "", next: "", confirm: "" });
  };

  const deleteAccount = () => {
    if (!window.confirm("This action is irreversible. Continue?")) return;
    console.log("DELETE ACCOUNT");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* ================= BASIC INFO ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal details.
        </p>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Role</label>
            <input
              value={form.role}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={saveProfile}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= PASSWORD ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">
          Change Password
        </h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            value={password.current}
            onChange={(e) =>
              setPassword({ ...password, current: e.target.value })
            }
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="New password"
            value={password.next}
            onChange={(e) =>
              setPassword({ ...password, next: e.target.value })
            }
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={password.confirm}
            onChange={(e) =>
              setPassword({ ...password, confirm: e.target.value })
            }
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={changePassword}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* ================= DANGER ZONE ================= */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h3 className="text-base font-semibold text-rose-700">
          Danger Zone
        </h3>
        <p className="mt-1 text-sm text-rose-600">
          Permanently delete your admin account.
        </p>

        <div className="mt-4">
          <button
            onClick={deleteAccount}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
