import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboardTeacher,
  faClock,
  faBookOpen,
  faFileLines,
  faClipboardList,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import "./classDetails.css";

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="class-details-page">
      {/* HEADER */}
      <div className="class-header">
        <h1>
          <FontAwesomeIcon icon={faBookOpen} /> Physics
        </h1>

        <div className="class-meta">
          <span>
            <FontAwesomeIcon icon={faChalkboardTeacher} /> Mr. A. Perera
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> Mon & Wed · 6:00 PM – 7:30 PM
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="class-tabs">
        <button
          className={`tab ${!location.pathname.includes("materials") ? "active" : ""}`}
          onClick={() => navigate(`/student/classes/${classId}`)}
        >
          <FontAwesomeIcon icon={faBookOpen} /> Overview
        </button>

        <button
          className={`tab ${isActive("materials") ? "active" : ""}`}
          onClick={() => navigate(`/student/classes/${classId}/materials`)}
        >
          <FontAwesomeIcon icon={faFileLines} /> Materials
        </button>

        <button
          className="tab"
          onClick={() => navigate(`/student/assignments`)}
        >
          <FontAwesomeIcon icon={faClipboardList} /> Assignments
        </button>

        <button
          className="tab"
          onClick={() => navigate(`/student/live-classes`)}
        >
          <FontAwesomeIcon icon={faVideo} /> Live Classes
        </button>
      </div>

      {/* CONTENT */}
      <div className="class-content">
        <h3>Class Overview</h3>
        <p>
          This class covers fundamental concepts in Physics aligned with the
          current academic syllabus. Lecture recordings, study materials,
          assignments, and live sessions will be available through this page.
        </p>

        <p>
          Please ensure you regularly check announcements and complete
          assignments before deadlines.
        </p>
      </div>
    </div>
  );
};

export default ClassDetails;
