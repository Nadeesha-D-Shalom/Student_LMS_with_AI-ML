import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="student-topbar">
      {/* LEFT TITLE */}
      <div className="topbar-left">
        <span className="topbar-title">Student Dashboard</span>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="topbar-right">
        <div className="topbar-icon">
          <FontAwesomeIcon icon={faBell} />
          <span className="notification-badge">3</span>
        </div>

        <div
          className="profile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
          <FontAwesomeIcon icon={faChevronDown} size="sm" />

          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-item">Profile</div>
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-item logout">Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
