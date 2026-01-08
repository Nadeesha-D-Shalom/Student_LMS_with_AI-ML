import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/student/announcements");
      const list = Array.isArray(res) ? res : res?.items || [];
      setItems(list);
    } catch (e) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-6">Loading announcements...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Official updates from your institute and teachers.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="font-semibold">Unable to load</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-base font-semibold text-slate-900">
            No announcements
          </div>
          <div className="mt-1 text-sm text-slate-600">
            You are up to date. Check again later.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {a.title || "Announcement"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {a.published_at ? a.published_at.toString().slice(0, 10) : ""}
                    {a.publisher_role ? ` · ${a.publisher_role}` : ""}
                    {a.class_name ? ` · ${a.class_name}` : ""}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  New
                </span>
              </div>

              <div className="mt-3 text-sm leading-6 text-slate-700">
                {a.message || a.content || "No message"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
