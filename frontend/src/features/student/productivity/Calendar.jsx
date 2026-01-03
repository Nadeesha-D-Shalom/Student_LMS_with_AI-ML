import React, { useEffect, useState } from "react";
import "./calendar.css";

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [events] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/calendar
    */
    setLoading(false);
  }, []);

  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1>Calendar</h1>
        <p>View your classes, tests, and assignment deadlines.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading calendar...
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="empty-state">
          <p>No events scheduled yet.</p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
