import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const loadAnnouncements = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/student/notices");
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
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
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

      {/* Empty */}
      {!error && items.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
          No announcements available
        </div>
      )}

      {/* Announcement List */}
      <div className="space-y-4">
        {items.map((a) => {
          const isOpen = openId === a.id;

          const title =
            a.title && a.title.trim() !== ""
              ? a.title
              : "Announcement";

          return (
            <div
              key={a.id}
              className="rounded-xl border bg-white transition hover:border-blue-300"
            >
              {/* Summary */}
              <button
                onClick={() => setOpenId(isOpen ? null : a.id)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left"
              >
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Published on {formatDate(a.published_at)}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                  Notice
                </span>
              </button>

              {/* Details */}
              {isOpen && (
                <div className="border-t px-5 py-4 space-y-4 text-sm text-slate-700">

                  {/* Content */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {a.content}
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-1 gap-3 pt-3 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      <span className="font-semibold text-slate-600">
                        Published by:
                      </span>{" "}
                      {a.teacher_name}
                    </div>

                    <div>
                      <span className="font-semibold text-slate-600">
                        Class ID:
                      </span>{" "}
                      {a.id ?? "-"}
                    </div>


                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Announcements;
