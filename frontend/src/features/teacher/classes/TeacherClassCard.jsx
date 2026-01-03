import React from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherClassCard({ data }) {
  const navigate = useNavigate();

  return (
    <div className="teacher-class-card">
      <div className="teacher-class-header">
        <div className="teacher-class-title">{data.subject}</div>
        <div className="teacher-class-sub">Conducted Grades</div>
      </div>

      <div className="teacher-grade-list">
        {data.grades.map((grade) => (
          <button
            key={grade}
            className="teacher-grade-btn"
            onClick={() =>
              navigate(`/teacher/classes/${data.id}/grade/${grade}`)
            }
          >
            {grade}
          </button>
        ))}
      </div>

      <div className="teacher-class-footer">
        Grades are visible only to enrolled students.
      </div>
    </div>
  );
}
