import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/student/announcements");
      setItems(res.items || []);
    } catch {
      setError("Failed to load announcements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
        Loading announcements...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl border border-blue-200 bg-yellow-100 p-6">
        <h1 className="text-lg font-semibold text-slate-900">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Official notices and updates from your institute
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && items.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
          No announcements available at the moment
        </div>
      )}

      {/* Announcement List */}
      <div className="space-y-4">
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {a.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(a.published_at).toLocaleString()}
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700">
                Announcement
              </span>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {a.message}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Announcements;
