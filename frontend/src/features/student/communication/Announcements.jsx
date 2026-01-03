import React, { useEffect, useState } from "react";
import "./announcements.css";

const Announcements = () => {
  const [loading, setLoading] = useState(true);
  const [announcements] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/announcements
    */
    setLoading(false);
  }, []);

  return (
    <div className="announcements-page">
      <div className="page-header">
        <h1>Announcements</h1>
        <p>Important updates from the institute and your teachers.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading announcements...
        </div>
      )}

      {!loading && announcements.length === 0 && (
        <div className="empty-state">
          <p>No announcements available at the moment.</p>
        </div>
      )}

      {!loading && announcements.length > 0 && (
        <div className="announcement-list">
          {announcements.map((a) => (
            <div key={a.id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.message}</p>
              <span className="timestamp">{a.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
