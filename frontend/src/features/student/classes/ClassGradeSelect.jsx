import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";
import "./classGradeSelect.css";

const ClassGradeSelect = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGrades = useCallback(async () => {
    try {
      const res = await apiFetch(
        `/api/student/classes/${classId}/grades`
      );
      setGrades(res.items || []);
    } catch {
      setError("Unable to load class details");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  if (loading) {
    return <div className="page-loading">Loading class...</div>;
  }

  return (
    <div className="grade-select-page">
      <h1 className="page-title">Select Grade</h1>
      <p className="page-subtitle">
        Choose your grade to access lessons, assignments, and exams
      </p>

      {error && <div className="page-error">{error}</div>}

      {grades.length === 0 ? (
        <div className="empty-state">
          Grade information not available yet.
        </div>
      ) : (
        <div className="grade-grid">
          {grades.map((g) => (
            <div
              key={g.grade_id}
              className="grade-card"
              onClick={() =>
                navigate(
                  `/student/classes/${classId}/grade/${g.grade_id}`
                )
              }
            >
              <h3>{g.label}</h3>
              <p>Access class workspace</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassGradeSelect;
