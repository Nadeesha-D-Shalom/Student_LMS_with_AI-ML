import React from "react";
import { useParams } from "react-router-dom";
import "./classWorkspace.css";

export default function ClassWorkspace() {
  const { classId, gradeId } = useParams();

  /* ===== MOCK DATA (FROM TEACHER CONTENT) ===== */
  const notices = [
    {
      id: 1,
      classId: "ict-grade-10",
      text: "Exam postponed to next week",
      date: "12 Feb 2026"
    }
  ];

  const weeks = [
    {
      id: 1,
      classId: "ict-grade-10",
      title: "10 February – 16 February",
      items: [
        { id: 1, type: "file", name: "Lecture 1 – Part 1.pdf" },
        { id: 2, type: "file", name: "Lecture 1 – Part 2.pdf" },
        { id: 3, type: "link", name: "Javascript tutorial" }
      ]
    },
    {
      id: 2,
      classId: "ict-grade-10",
      title: "17 February – 23 February",
      items: [
        { id: 4, type: "file", name: "Worksheet – Variables.pdf" }
      ]
    }
  ];

  const classNotices = notices.filter(n => n.classId === classId);
  const classWeeks = weeks.filter(w => w.classId === classId);

  return (
    <div className="student-workspace">
      {/* HEADER */}
      <div className="student-workspace-header">
        <h2>
          {classId.replace(/-/g, " ").toUpperCase()} — Grade {gradeId}
        </h2>
      </div>

      {/* ===== NOTICES ===== */}
      {classNotices.length > 0 && (
        <div className="student-notice-section">
          <h3>Notices</h3>
          {classNotices.map(n => (
            <div key={n.id} className="student-notice-card">
              <div className="student-notice-date">{n.date}</div>
              <div>{n.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ===== WEEKS ===== */}
      {classWeeks.map(week => (
        <div key={week.id} className="student-week-box">
          <div className="student-week-title">{week.title}</div>

          <ul className="student-material-list">
            {week.items.map(item => (
              <li key={item.id} className="student-material-item">
                <span className="student-material-icon">
                  {item.type === "file" ? "📄" : "🔗"}
                </span>
                <span className="student-material-name">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
