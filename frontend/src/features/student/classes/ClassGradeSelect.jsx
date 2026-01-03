import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./classGradeSelect.css";

/* =========================
   UI-ONLY GRADE DATA
========================= */

const gradesByClass = {
  1: [
    { id: "al12", label: "A/L Grade 12" },
    { id: "al13", label: "A/L Grade 13" }
  ],
  2: [
    { id: "al12", label: "A/L Grade 12" },
    { id: "al13", label: "A/L Grade 13" }
  ],
  3: [
    { id: "ol10", label: "O/L Grade 10" },
    { id: "ol11", label: "O/L Grade 11" }
  ]
};

const ClassGradeSelect = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const grades = gradesByClass[classId] || [];

  return (
    <div className="grade-select-page">
      <h1 className="page-title">Select Grade</h1>
      <p className="page-subtitle">
        Choose your grade for this class
      </p>

      <div className="grade-grid">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="grade-card"
            onClick={() =>
              navigate(
                `/student/classes/${classId}/grade/${grade.id}`
              )
            }
          >
            <h3>{grade.label}</h3>
            <span>View materials & assignments</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassGradeSelect;
