import React, { useEffect, useState } from "react";
import { apiFetch } from "../../../api/api";

const LiveClasses = () => {
  const [data, setData] = useState({
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/student/live-classes");

        setData({
          upcoming: Array.isArray(res?.upcoming) ? res.upcoming : [],
          past: Array.isArray(res?.past) ? res.past : []
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading live classes...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl bg-white border p-5">
        <h1 className="text-lg font-semibold">Live Classes</h1>
        <p className="text-sm text-slate-600">
          Join your scheduled online sessions
        </p>
      </div>

      {/* Upcoming */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Upcoming</h2>

        {data.upcoming.length === 0 ? (
          <div className="bg-red-100 border rounded-xl p-6 text-center text-slate-500">
            This Option Will be Added Future
          </div>
        ) : (
          data.upcoming.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center bg-white border rounded-xl p-4"
            >
              <div>
                <div className="font-semibold">{c.class_name}</div>
                <div className="text-sm text-slate-600">
                  {c.session_date} · {c.start_time} - {c.end_time}
                </div>
              </div>

              {c.meeting_url && (
                <a
                  href={c.meeting_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700"
                >
                  Join
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Past */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Past Sessions</h2>

        {data.past.length === 0 ? (
          <div className="bg-red-100 border rounded-xl p-6 text-center text-slate-500">
            This Option Will be Added Future
          </div>
        ) : (
          data.past.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center bg-white border rounded-xl p-4 opacity-60"
            >
              <div>
                <div className="font-semibold">{c.class_name}</div>
                <div className="text-sm">
                  {c.session_date} · {c.start_time} - {c.end_time}
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                Ended
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default LiveClasses;
