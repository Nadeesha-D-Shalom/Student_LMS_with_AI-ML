import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";
import "./classes.css";

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await apiFetch("/api/student/classes");
      setClasses(res.items || []);
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading classes...</div>;
  }

  return (
    <div className="classes-page">
      <h1 className="page-title">My Classes</h1>
      <p className="page-subtitle">
        Your enrolled O/L and A/L private classes
      </p>

      {error && <div className="page-error">{error}</div>}

      {classes.length === 0 ? (
        <div className="empty-state">
          You are not enrolled in any classes yet.
        </div>
      ) : (
        <div className="classes-table">
          <div className="classes-header">
            <span>Subject</span>
            <span>Teacher</span>
            <span>Schedule</span>
            <span></span>
          </div>

          {classes.map((cls) => (
            <div key={cls.class_id} className="classes-row">
              <span className="subject">
                <FontAwesomeIcon icon={faBook} />{" "}
                {cls.subject_name} (Grade {cls.grade})
              </span>

              <span>
                <FontAwesomeIcon icon={faUser} /> {cls.teacher_name}
              </span>

              <span className="schedule">
                <FontAwesomeIcon icon={faClock} />{" "}
                {cls.schedules.length === 0
                  ? "Schedule not assigned"
                  : cls.schedules
                      .map(
                        (s) =>
                          `${s.day_of_week} · ${s.start_time} - ${s.end_time}`
                      )
                      .join(", ")}
              </span>

              <button
                className="enter-btn"
                onClick={() =>
                  navigate(`/student/classes/${cls.class_id}`)
                }
              >
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
