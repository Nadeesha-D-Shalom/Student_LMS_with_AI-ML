import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faCircleQuestion,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

export default function TeacherSidebar() {
  return (
    <aside className="teacher-sidebar">
      {/* BRAND */}
      <div className="teacher-brand">
        <div className="teacher-brand-title">Teacher Panel</div>
        <div className="teacher-brand-sub">
          Manage classes, content, and assessments
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="teacher-nav">
        <NavLink to="/teacher/dashboard">Dashboard</NavLink>
        <NavLink to="/teacher/classes">My Classes</NavLink>
        <NavLink to="/teacher/students">Students</NavLink>
        <NavLink to="/teacher/content">Materials & Notices</NavLink>
        <NavLink to="/teacher/assignments">Assignments</NavLink>
        <NavLink to="/teacher/tests">Tests</NavLink>
        <NavLink to="/teacher/messages">Messages</NavLink>
      </nav>

      {/* FOOTER (ALWAYS BOTTOM) */}
      <div className="sidebar-footer">
        <ul>
          <li>
            <NavLink to="/teacher/profile">
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/teacher/settings">
              <FontAwesomeIcon icon={faGear} />
              <span>Settings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/teacher/help">
              <FontAwesomeIcon icon={faCircleQuestion} />
              <span>Help</span>
            </NavLink>
          </li>
          <li className="logout">
            <NavLink to="/login" className="flex  gap-3 px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 rounded-xl">
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}
