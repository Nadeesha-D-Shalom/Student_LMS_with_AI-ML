import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faGauge,
  faBook,
  faVideo,
  faFileLines,
  faQuestionCircle,
  faBullhorn,
  // faCalendar,
  // faListCheck,
  faUser,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";

const Sidebar = () => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState("");
  const [unread, setUnread] = useState(0);

  /* -------------------------------
     Detect section from URL
  -------------------------------- */
  useEffect(() => {
    const path = location.pathname;

    if (
      path.startsWith("/student/messages") ||
      path.startsWith("/student/questions") ||
      path.startsWith("/student/announcements")
    ) {
      setOpenSection("communication");
    } else if (
      path.startsWith("/student/dashboard") ||
      path.startsWith("/student/classes") ||
      path.startsWith("/student/live-classes") ||
      path.startsWith("/student/recordings")
    ) {
      setOpenSection("learning");
    } else if (
      path.startsWith("/student/calendar") ||
      path.startsWith("/student/todo")
    ) {
      setOpenSection("planning");
    }
  }, [location.pathname]);

  /* -------------------------------
     Unread messages count
  -------------------------------- */
  const loadUnread = async () => {
    try {
      const res = await apiFetch("/api/student/messages-unread-count");
      setUnread(res.count || 0);
    } catch {
      setUnread(0);
    }
  };

  useEffect(() => {
    loadUnread();
    window.addEventListener("messages-updated", loadUnread);
    return () => window.removeEventListener("messages-updated", loadUnread);
  }, []);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition ${
      isActive
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <aside className="w-64 min-h-screen border-r bg-white flex flex-col">

      {/* Brand */}
      <div className="px-6 py-5 border-b">
        <h2 className="text-lg font-bold text-slate-800">LMS</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">

        {/* AI */}
        <div>
          <p className="px-4 text-xs font-bold text-slate-400 mb-2">
            AI ASSISTANT
          </p>
          <a
            href="/ai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600"
          >
            <FontAwesomeIcon icon={faRobot} />
            NexDS AI
          </a>
        </div>

        {/* LEARNING */}
        <div>
          <p
            className="px-4 text-xs font-bold text-slate-400 mb-2 cursor-pointer"
            onClick={() => setOpenSection("learning")}
          >
            LEARNING
          </p>

          {openSection === "learning" && (
            <div className="space-y-1">
              <NavLink to="/student/dashboard" className={navClass}>
                <FontAwesomeIcon icon={faGauge} />
                Dashboard
              </NavLink>

              <NavLink to="/student/classes" className={navClass}>
                <FontAwesomeIcon icon={faBook} />
                My Classes
              </NavLink>

              <NavLink to="/student/live-classes" className={navClass}>
                <FontAwesomeIcon icon={faVideo} />
                Live Classes
              </NavLink>

              <NavLink to="/student/recordings" className={navClass}>
                <FontAwesomeIcon icon={faFileLines} />
                Recorded Lessons
              </NavLink>
            </div>
          )}
        </div>

        {/* COMMUNICATION */}
        <div>
          <p
            className="px-4 text-xs font-bold text-slate-400 mb-2 cursor-pointer"
            onClick={() => setOpenSection("communication")}
          >
            COMMUNICATION
          </p>

          {openSection === "communication" && (
            <div className="space-y-1">
              <NavLink to="/student/messages" className={navClass}>
                <FontAwesomeIcon icon={faEnvelope} />
                <span className="flex-1">Messages</span>
                {unread > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </NavLink>

              <NavLink to="/student/questions" className={navClass}>
                <FontAwesomeIcon icon={faQuestionCircle} />
                Ask a Question
              </NavLink>

              <NavLink to="/student/announcements" className={navClass}>
                <FontAwesomeIcon icon={faBullhorn} />
                Announcements
              </NavLink>
            </div>
          )}
        </div>

        {/* PLANNING */}
        {/* <div>
          <p
            className="px-4 text-xs font-bold text-slate-400 mb-2 cursor-pointer"
            onClick={() => setOpenSection("planning")}
          >
            PLANNING
          </p>

          {openSection === "planning" && (
            <div className="space-y-1">
              <NavLink to="/student/calendar" className={navClass}>
                <FontAwesomeIcon icon={faCalendar} />
                Calendar
              </NavLink>

              <NavLink to="/student/todo" className={navClass}>
                <FontAwesomeIcon icon={faListCheck} />
                To-Do List
              </NavLink>
            </div>
          )}
        </div> */}
      </nav>

      {/* Footer */}
      <div className="border-t px-3 py-4 space-y-1">
        <NavLink to="/student/profile" className={navClass}>
          <FontAwesomeIcon icon={faUser} />
          Profile
        </NavLink>

        <NavLink to="/student/settings" className={navClass}>
          <FontAwesomeIcon icon={faGear} />
          Settings
        </NavLink>

        <NavLink to="/student/help" className={navClass}>
          <FontAwesomeIcon icon={faCircleQuestion} />
          Help
        </NavLink>

        <div className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-xl">
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
