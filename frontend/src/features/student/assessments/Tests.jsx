import React, { useEffect, useState } from "react";
import "./tests.css";

const Tests = () => {
  const [loading, setLoading] = useState(true);
  const [tests] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/tests
    */
    setLoading(false);
  }, []);

  return (
    <div className="tests-page">
      <div className="page-header">
        <h1>Tests</h1>
        <p>View and attempt your online tests.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading tests...
        </div>
      )}

      {!loading && tests.length === 0 && (
        <div className="empty-state">
          <p>No tests available at the moment.</p>
        </div>
      )}

      {!loading && tests.length > 0 && (
        <table className="tests-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Test Name</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.id}>
                <td>{t.subject}</td>
                <td>{t.title}</td>
                <td>{t.duration} mins</td>
                <td>
                  <span className={`status ${t.status}`}>
                    {t.statusLabel}
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

export default Tests;
