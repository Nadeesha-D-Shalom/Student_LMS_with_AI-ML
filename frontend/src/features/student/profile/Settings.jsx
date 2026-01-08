import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await apiFetch("/api/student/settings");
      setEmailNotifications(!!res?.email_notifications);
      setSmsNotifications(!!res?.sms_notifications);
      setDarkMode(!!res?.dark_mode);
      setLanguage(res?.language || "en");
    } catch (e) {
      setError(e.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setOk("");
    try {
      await apiFetch("/api/student/settings", {
        method: "PUT",
        body: JSON.stringify({
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          dark_mode: darkMode,
          language
        })
      });
      setOk("Settings updated");
      await load();
    } catch (e) {
      setError(e.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage notifications and preferences.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="font-semibold">Unable to continue</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {ok && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <div className="font-semibold">Success</div>
          <div className="mt-1">{ok}</div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <label className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Email notifications
            </div>
            <div className="text-sm text-slate-600">
              Receive updates by email.
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              SMS notifications
            </div>
            <div className="text-sm text-slate-600">
              Receive urgent updates via SMS.
            </div>
          </div>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Dark mode
            </div>
            <div className="text-sm text-slate-600">
              UI preference (for later UI theme integration).
            </div>
          </div>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <div>
          <div className="text-sm font-semibold text-slate-900">Language</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
            ].join(" ")}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
