import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faChevronDown,
  faUser,
  faGear,
  faCircleQuestion,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import "./topbar.css";

const Topbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    /*
      AUTH (LATER)
      - Clear token
      - Redirect to /login
    */
    navigate("/login");
  };

  return (
    <header className="student-topbar">
      {/* LEFT TITLE */}
      <div className="topbar-left">
        <span className="topbar-title">Student Dashboard</span>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="topbar-right">
        {/* NOTIFICATIONS */}
        <div className="topbar-icon">
          <FontAwesomeIcon icon={faBell} />
          <span className="notification-badge">3</span>
        </div>

        {/* PROFILE MENU */}
        <div
          className="profile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faUserCircle} size="lg" />
          <FontAwesomeIcon icon={faChevronDown} size="sm" />

          {open && (
            <div className="profile-dropdown">
              <div
                className="dropdown-item"
                onClick={() => handleNavigate("/student/profile")}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleNavigate("/student/settings")}
              >
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleNavigate("/student/help")}
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
                <span>Help</span>
              </div>

              <div className="dropdown-divider" />

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
