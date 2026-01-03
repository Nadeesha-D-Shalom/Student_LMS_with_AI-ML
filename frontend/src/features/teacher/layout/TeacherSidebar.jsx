import React from "react";
import { NavLink } from "react-router-dom";

export default function TeacherSidebar() {
  return (
    <aside className="teacher-sidebar">
      <div className="teacher-brand">
        <div className="teacher-brand-title">Teacher Panel</div>
        <div className="teacher-brand-sub">Manage classes, grades, and students</div>
      </div>

      <nav className="teacher-nav">
        <NavLink to="/teacher/dashboard">Dashboard</NavLink>
        <NavLink to="/teacher/classes">My Classes</NavLink>
        <NavLink to="/teacher/students">Students</NavLink>
        <NavLink to="/teacher/content">Materials & Notices</NavLink>
        <NavLink to="/teacher/assignments">Assignments</NavLink>
        <NavLink to="/teacher/tests">Tests</NavLink>
        <NavLink to="/teacher/messages">Messages</NavLink>

      </nav>
    </aside>
  );
}
