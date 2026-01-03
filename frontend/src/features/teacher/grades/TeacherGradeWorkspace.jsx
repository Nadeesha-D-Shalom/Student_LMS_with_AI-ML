import React from "react";
import { useParams } from "react-router-dom";
import "./teacherGradeWorkspace.css";

export default function TeacherGradeWorkspace() {
  const { classId, gradeId } = useParams();

  /* MOCK — later comes from store / backend */
  const publishedContent = [
    {
      id: 1,
      type: "notice",
      text: "Exam postponed to next week",
      targets: ["ict-grade-10"],
      date: "2026-02-10"
    },
    {
      id: 2,
      type: "material",
      fileName: "Chapter-1-Notes.pdf",
      targets: ["ict-grade-10"],
      date: "2026-02-09"
    }
  ];

  const filtered = publishedContent.filter((p) =>
    p.targets.includes(classId)
  );

  return (
    <div className="teacher-grade-workspace">
      <h2>
        {classId.replace(/-/g, " ").toUpperCase()} — Grade {gradeId}
      </h2>
      <p>Preview of content delivered to this class</p>

      {filtered.length === 0 ? (
        <div className="teacher-empty">No content assigned yet.</div>
      ) : (
        filtered.map((c) => (
          <div key={c.id} className="teacher-material-card">
            <strong>{c.type.toUpperCase()}</strong>
            <div>{c.type === "notice" ? c.text : c.fileName}</div>
            <div className="teacher-material-meta">{c.date}</div>
          </div>
        ))
      )}
    </div>
  );
}
