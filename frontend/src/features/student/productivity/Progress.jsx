import React, { useEffect, useState } from "react";
import "./progress.css";

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [summary] = useState(null);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/progress
    */
    setLoading(false);
  }, []);

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1>Progress</h1>
        <p>Track your learning progress and performance.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading progress...
        </div>
      )}

      {!loading && !summary && (
        <div className="empty-state">
          <p>No progress data available yet.</p>
        </div>
      )}
    </div>
  );
};

export default Progress;
