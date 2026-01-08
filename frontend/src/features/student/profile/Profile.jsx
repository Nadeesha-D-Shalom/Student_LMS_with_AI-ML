import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Editable
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password
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

      setLastName(res.last_name || "");
      setPhone(res.phone || "");
      setAddress(res.address || "");
      setBio(res.bio || "");
      setAvatarUrl(res.avatar_url || "");
    } catch {
      setError("Failed to load profile");
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

      setOk("Profile updated successfully");
      await load();
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setSavingPwd(true);
    setError("");
    setOk("");

    if (!currentPassword) {
      setError("Current password is required");
      setSavingPwd(false);
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      setSavingPwd(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setSavingPwd(false);
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
      setError(e.message || "Password update failed");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading profile…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your personal information and security settings.
        </p>
      </div>

      {/* ALERTS */}
      {error && <Alert type="error" text={error} />}
      {ok && <Alert type="success" text={ok} />}

      {/* PROFILE CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT – AVATAR */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col items-center">
          <div className="h-28 w-28 rounded-full overflow-hidden border bg-slate-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                No Avatar
              </div>
            )}
          </div>

          <div className="mt-4 w-full">
            <Label>Avatar URL</Label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border px-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="lg:col-span-2 rounded-2xl border bg-white p-6 shadow-sm space-y-6">

          {/* LOCKED */}
          <Section title="Account Information">
            <TwoCols>
              <LockedInput label="First Name" value={data.first_name} />
              <LockedInput label="Email" value={data.email} />
            </TwoCols>
          </Section>

          {/* EDITABLE */}
          <Section title="Personal Details">
            <TwoCols>
              <Input label="Last Name" value={lastName} onChange={setLastName} />
              <Input label="Phone" value={phone} onChange={setPhone} />
            </TwoCols>

            <Input label="Address" value={address} onChange={setAddress} full />
            <Textarea label="Bio" value={bio} onChange={setBio} />
          </Section>

          <div className="flex justify-end">
            <PrimaryButton onClick={saveProfile} loading={saving}>
              Save Profile
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* SECURITY */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Security</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Password label="Current Password" value={currentPassword} onChange={setCurrentPassword} />
          <Password label="New Password" value={newPassword} onChange={setNewPassword} />
          <Password label="Confirm Password" value={confirmNewPassword} onChange={setConfirmNewPassword} />
        </div>

        <div className="flex justify-end">
          <SecondaryButton onClick={changePassword} loading={savingPwd}>
            Update Password
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

/* ---------- UI HELPERS ---------- */

const Alert = ({ type, text }) => (
  <div className={`rounded-xl border p-4 text-sm ${
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800"
  }`}>
    {text}
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <div className="text-sm font-semibold text-slate-800">{title}</div>
    {children}
  </div>
);

const TwoCols = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Label = ({ children }) => (
  <label className="text-xs font-medium text-slate-500">{children}</label>
);

const Input = ({ label, value, onChange, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <Label>{label}</Label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-xl border px-4 py-2 text-sm"
    />
  </div>
);

const LockedInput = ({ label, value }) => (
  <div>
    <Label>{label} (Locked)</Label>
    <input
      value={value}
      disabled
      className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-2 text-sm"
    />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full min-h-[110px] rounded-xl border px-4 py-2 text-sm"
    />
  </div>
);

const Password = ({ label, value, onChange }) => (
  <div>
    <Label>{label}</Label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-xl border px-4 py-2 text-sm"
    />
  </div>
);

const PrimaryButton = ({ children, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
  >
    {loading ? "Saving..." : children}
  </button>
);

const SecondaryButton = ({ children, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-400"
  >
    {loading ? "Updating..." : children}
  </button>
);

export default Profile;
