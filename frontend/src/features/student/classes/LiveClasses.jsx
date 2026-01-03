import React, { useEffect, useState } from "react";
import "./liveClasses.css";

const LiveClasses = () => {
  const [loading, setLoading] = useState(true);
  const [liveClasses] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/live-classes

      For now:
      - No mock data
      - Just stop loading
    */
    setLoading(false);
  }, []);

  return (
    <div className="live-classes-page">
      <div className="page-header">
        <h1>Live Classes</h1>
        <p>Join your scheduled live sessions here.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading live classes...
        </div>
      )}

      {!loading && liveClasses.length === 0 && (
        <div className="empty-state">
          <p>No live classes scheduled at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default LiveClasses;
