import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  // Editable fields
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await apiFetch("/api/student/profile");
      setData(res);

      setLastName(res?.last_name || "");
      setPhone(res?.phone || "");
      setAddress(res?.address || "");
      setBio(res?.bio || "");
      setAvatarUrl(res?.avatar_url || "");
    } catch (e) {
      setError(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setOk("");

    try {
      await apiFetch("/api/student/profile", {
        method: "PUT",
        body: JSON.stringify({
          last_name: lastName,
          phone,
          address,
          bio,
          avatar_url: avatarUrl
        })
      });
      setOk("Profile updated");
      await load();
    } catch (e) {
      setError(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setSavingPwd(true);
    setError("");
    setOk("");

    if (!currentPassword.trim()) {
      setSavingPwd(false);
      setError("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      setSavingPwd(false);
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSavingPwd(false);
      setError("New password and confirmation do not match");
      return;
    }

    try {
      await apiFetch("/api/student/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      setOk("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      setError(e.message || "Failed to change password");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Email and First Name are locked. You can update the remaining details.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="font-semibold">Action required</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {ok && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="font-semibold">Success</div>
          <div className="mt-1">{ok}</div>
        </div>
      )}

      {/* Locked fields */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              First Name (Locked)
            </label>
            <input
              value={data?.first_name || ""}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Email (Locked)
            </label>
            <input
              value={data?.email || ""}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editable fields */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              Address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              Avatar URL
            </label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-600">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 w-full min-h-[110px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={saveProfile}
            disabled={saving}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900">
          Change Password
        </div>
        <p className="mt-1 text-sm text-slate-600">
          You must enter your current password to change it.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={changePassword}
            disabled={savingPwd}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              savingPwd ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700"
            ].join(" ")}
          >
            {savingPwd ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
