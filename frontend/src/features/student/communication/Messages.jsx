import React, { useEffect, useState } from "react";
import "./messages.css";

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [conversations] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/messages
    */
    setLoading(false);
  }, []);

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Messages</h1>
        <p>Communicate with your teachers.</p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading messages...
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="empty-state">
          <p>No conversations available.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
