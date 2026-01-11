import React, { useEffect } from "react";
import { apiFetch } from "../../../api/api";

const Topbar = () => {
  useEffect(() => {
    apiFetch("/api/student/notifications-count").catch(() => {});
  }, []);

  return (
    <header className="student-topbar">
      <div className="topbar-left">
        <span className="topbar-title">Student Dashboard</span>
      </div>
    </header>
  );
};

export default Topbar;
