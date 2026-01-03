import React, { useEffect, useState } from "react";
import "./results.css";

const Results = () => {
  const [loading, setLoading] = useState(true);
  const [results] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/results
    */
    setLoading(false);
  }, []);

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>Results</h1>
        <p>View your grades and teacher feedback.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading results...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="empty-state">
          <p>No results published yet.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assessment</th>
              <th>Score</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.subject}</td>
                <td>{r.title}</td>
                <td>{r.score}</td>
                <td>{r.feedback || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;
