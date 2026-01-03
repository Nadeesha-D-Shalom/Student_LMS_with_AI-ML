import React, { useEffect, useState } from "react";
import "./classRecordings.css";

const ClassRecordings = () => {
  const [loading, setLoading] = useState(true);
  const [recordings] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/recordings
    */
    setLoading(false);
  }, []);

  return (
    <div className="recordings-page">
      <div className="page-header">
        <h1>Recorded Lessons</h1>
        <p>Access all recorded lessons provided by your teachers.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading recorded lessons...
        </div>
      )}

      {!loading && recordings.length === 0 && (
        <div className="empty-state">
          <p>No recorded lessons available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ClassRecordings;
