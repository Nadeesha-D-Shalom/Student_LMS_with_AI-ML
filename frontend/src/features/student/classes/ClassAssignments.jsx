import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faClock,
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import "./classAssignments.css";

const assignments = [
  {
    id: 1,
    title: "Lab Sheet 07 – Trees",
    due: "30 Apr 2025 · 10:30 AM",
    status: "submitted"
  },
  {
    id: 2,
    title: "Lab Sheet 08 – Recursion",
    due: "12 May 2025 · 11:59 PM",
    status: "pending"
  },
  {
    id: 3,
    title: "Lab Sheet 09 – Finite Automata",
    due: "26 May 2025 · 12:30 PM",
    status: "overdue"
  }
];

const ClassAssignments = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="class-assignments-page">
      <h2>
        <FontAwesomeIcon icon={faClipboardList} /> Assignments
      </h2>

      {assignments.map((a) => (
        <div key={a.id} className={`assignment-card ${a.status}`}>
          <div className="assignment-info">
            <h4>{a.title}</h4>
            <span>
              <FontAwesomeIcon icon={faClock} /> Due: {a.due}
            </span>
          </div>

          <div className="assignment-status">
            {a.status === "submitted" && (
              <span className="submitted">
                <FontAwesomeIcon icon={faCheckCircle} /> Submitted
              </span>
            )}
            {a.status === "pending" && (
              <span className="pending">Pending</span>
            )}
            {a.status === "overdue" && (
              <span className="overdue">
                <FontAwesomeIcon icon={faExclamationCircle} /> Overdue
              </span>
            )}
          </div>

          <button
            className="open-btn"
            onClick={() =>
              navigate(`/student/classes/${classId}/assignments/${a.id}`)
            }
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClassAssignments;