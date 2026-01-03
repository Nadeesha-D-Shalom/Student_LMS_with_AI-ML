import React from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherTopbar from "./TeacherTopbar";
import "./teacherLayout.css";

export default function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <TeacherSidebar />

      <div className="teacher-main">
        <TeacherTopbar />
        <main className="teacher-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
