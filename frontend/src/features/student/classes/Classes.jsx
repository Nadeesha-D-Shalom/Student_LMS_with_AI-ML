import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUser,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import "./classes.css";

/* =========================
   PRIVATE CLASS DATA (UI ONLY)
========================= */

const classesData = [
  {
    id: 1,
    subject: "Physics (A/L)",
    teacher: "Mr. A. Perera",
    schedule: "Mon & Wed · 6:00 PM – 7:30 PM"
  },
  {
    id: 2,
    subject: "Chemistry (A/L)",
    teacher: "Ms. S. Fernando",
    schedule: "Tue & Thu · 4:30 PM – 6:00 PM"
  },
  {
    id: 3,
    subject: "ICT (O/L)",
    teacher: "Mr. D. Silva",
    schedule: "Saturday · 9:00 AM – 11:00 AM"
  }
];

const Classes = () => {
  const navigate = useNavigate();

  return (
    <div className="classes-page">
      <h1 className="page-title">My Classes</h1>
      <p className="page-subtitle">
        Your enrolled O/L and A/L private classes
      </p>

      <div className="classes-table">
        <div className="classes-header">
          <span>Subject</span>
          <span>Teacher</span>
          <span>Schedule</span>
          <span></span>
        </div>

        {classesData.map((cls) => (
          <div key={cls.id} className="classes-row">
            <span className="subject">
              <FontAwesomeIcon icon={faBook} /> {cls.subject}
            </span>

            <span>
              <FontAwesomeIcon icon={faUser} /> {cls.teacher}
            </span>

            <span>
              <FontAwesomeIcon icon={faClock} /> {cls.schedule}
            </span>

            <button
              className="enter-btn"
              onClick={() => navigate(`/student/classes/${cls.id}`)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
