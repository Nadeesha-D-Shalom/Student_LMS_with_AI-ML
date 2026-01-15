// src/features/student/dashboard/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faBookOpen,
  faClipboardList,
  faRobot,
  faCalendar,
  faTriangleExclamation
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";
import "./dashboard.css";

const formatAnnouncementDate = (iso) => {
  if (!iso) return { day: "--", time: "--:--" };

  const d = new Date(iso);

  const day = d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short"
  });

  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  return { day, time };
};

const formatClassTime = (dateTimeOrTime) => {
  if (!dateTimeOrTime) return "";

  // If backend gives full datetime, format nicely
  const d = new Date(dateTimeOrTime);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }

  // If backend gives just a TIME string "18:00:00"
  const parts = String(dateTimeOrTime).split(":");
  if (parts.length >= 2) {
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (!Number.isNaN(hh) && !Number.isNaN(mm)) {
      const dt = new Date();
      dt.setHours(hh, mm, 0, 0);
      return dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    }
  }

  return String(dateTimeOrTime);
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [annRes, classRes] = await Promise.all([
        apiFetch("/api/student/notices"),
        apiFetch("/api/student/classes")
      ]);

      setAnnouncements(Array.isArray(annRes?.items) ? annRes.items : []);
      setClasses(Array.isArray(classRes?.items) ? classRes.items : []);
    } catch (e) {
      setError(e?.message || "Failed to load dashboard data");
      setAnnouncements([]);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const upcomingClasses = useMemo(() => {
    // We try to sort by a known time field if present; otherwise, keep top 2.
    const arr = [...classes];

    arr.sort((a, b) => {
      const aTime = a?.start_time || a?.startTime || a?.start_at || a?.startAt || "";
      const bTime = b?.start_time || b?.startTime || b?.start_at || b?.startAt || "";
      const ad = new Date(aTime);
      const bd = new Date(bTime);

      const av = Number.isNaN(ad.getTime()) ? 0 : ad.getTime();
      const bv = Number.isNaN(bd.getTime()) ? 0 : bd.getTime();

      return av - bv;
    });

    return arr.slice(0, 2);
  }, [classes]);

  return (
    <div className="dashboard-layout">
      {/* ================= IT SYSTEM ALERT ================= */}
      <div className="it-alert-banner">
        <div className="it-alert-left">
          <span className="it-blink-dot"></span>
          <strong>IT Department Notice</strong>
        </div>

        <div className="it-alert-message">
          LMS maintenance scheduled today from <b>10:00 PM – 12:00 AM</b>. During this
          time, the system may be unavailable.
        </div>
      </div>

      {/* ================= ERROR BANNER ================= */}
      {error && (
        <div
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          style={{ marginTop: 14 }}
        >
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 2 }} />
            <div>
              <div className="font-semibold">Dashboard data could not be loaded</div>
              <div className="mt-1">{error}</div>
              <button
                onClick={loadDashboard}
                className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
                type="button"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN GRID ================= */}
      <div className="dashboard-grid-main">
        {/* LEFT: ANNOUNCEMENTS */}
        <div className="dashboard-left">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBullhorn} /> Announcements
          </h2>

          {loading ? (
            <div className="rounded-xl border bg-white p-5 text-sm text-slate-600">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
              No announcements available
            </div>
          ) : (
            announcements.slice(0, 6).map((a) => {
              const { day, time } = formatAnnouncementDate(a.published_at);
              return (
                <div key={a.id} className="announcement-item">
                  <div className="announcement-date">
                    <span>{day}</span>
                    <small>{time}</small>
                  </div>
                  <div className="announcement-content">
                    <h4>{a.title}</h4>
                    <p>Institute</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: SIDE PANELS */}
        <div className="dashboard-right">
          {/* Upcoming Classes */}
          <div className="dashboard-box">
            <h3>
              <FontAwesomeIcon icon={faCalendar} /> Upcoming Classes
            </h3>

            {loading ? (
              <div className="text-sm text-slate-600" style={{ padding: "10px 0" }}>
                Loading classes...
              </div>
            ) : upcomingClasses.length === 0 ? (
              <div className="text-sm text-slate-600" style={{ padding: "10px 0" }}>
                No upcoming classes
              </div>
            ) : (
              upcomingClasses.map((c, idx) => {
                const subject = c.subject_name || c.subject || "Class";
                const teacher = c.teacher_name || c.teacher || "";
                const timeValue =
                  c.start_time || c.startTime || c.start_at || c.startAt || c.time || "";
                const niceTime = formatClassTime(timeValue);

                // Label: Today / Tomorrow / Upcoming (best-effort)
                let label = "Upcoming";
                const d = new Date(timeValue);
                if (!Number.isNaN(d.getTime())) {
                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                  const thatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                  const diffDays = Math.round((thatDay - today) / (24 * 60 * 60 * 1000));
                  if (diffDays === 0) label = "Today";
                  if (diffDays === 1) label = "Tomorrow";
                } else if (idx === 0) {
                  label = "Today";
                }

                return (
                  <div key={c.class_id || c.id || `${subject}-${idx}`} className="class-item">
                    <strong>{subject}</strong>
                    <span>
                      {label}
                      {niceTime ? ` · ${niceTime}` : ""}
                      {teacher ? ` · ${teacher}` : ""}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-box">
            <h3>Quick Actions</h3>

            <button
              className="action-btn primary"
              type="button"
              onClick={() => navigate("/student/classes")}
            >
              <FontAwesomeIcon icon={faBookOpen} /> Go to Classes
            </button>

            <button
              className="action-btn secondary"
              type="button"
              onClick={() => navigate("/student/assignments")}
            >
              <FontAwesomeIcon icon={faClipboardList} /> View Assignments
            </button>

            <button
              className="action-btn light"
              type="button"
              onClick={() => window.open("/ai", "_blank", "noreferrer")}
            >
              <FontAwesomeIcon icon={faRobot} /> NexDS AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
