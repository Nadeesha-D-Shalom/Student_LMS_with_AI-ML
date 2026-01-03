import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./assignments.css";

const Assignments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignments] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/assignments
    */
    setLoading(false);
  }, []);

  return (
    <div className="assignments-page">
      <div className="page-header">
        <h1>Assignments</h1>
        <p>Track and manage all your assignments here.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading assignments...
        </div>
      )}

      {!loading && assignments.length === 0 && (
        <div className="empty-state">
          <p>No assignments assigned yet.</p>
        </div>
      )}

      {!loading && assignments.length > 0 && (
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr
                key={a.id}
                onClick={() =>
                  navigate(
                    `/student/classes/${a.classId}/grade/${a.gradeId}/assignments/${a.id}`
                  )
                }
              >
                <td>{a.subject}</td>
                <td>{a.title}</td>
                <td>{a.dueDate}</td>
                <td>
                  <span className={`status ${a.status}`}>
                    {a.statusLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Assignments;
