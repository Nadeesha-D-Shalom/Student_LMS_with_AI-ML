import React from "react";

export default function TeacherDashboard() {
  return (
    <div>
      <h2 style={{ margin: "0 0 10px 0" }}>Overview</h2>
      <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
        This is the Teacher panel foundation. Next we will add:
        <ul>
          <li>My Classes → Add Grades (OL10/OL11/AL12/AL13)</li>
          <li>Grade Workspace (Notices, Materials by date, Assignments, Tests)</li>
          <li>Students list per class/grade and student profile</li>
        </ul>
      </div>
    </div>
  );
}
