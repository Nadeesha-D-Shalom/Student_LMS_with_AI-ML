import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faBookOpen,
  faClipboardList,
  faRobot,
  faCalendar
} from "@fortawesome/free-solid-svg-icons";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">

      {/* ================= IT SYSTEM ALERT ================= */}
      <div className="it-alert-banner">
        <div className="it-alert-left">
          <span className="it-blink-dot"></span>
          <strong>IT Department Notice</strong>
        </div>

        <div className="it-alert-message">
          LMS maintenance scheduled today from <b>10:00 PM – 12:00 AM</b>.
          During this time, the system may be unavailable.
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="dashboard-grid-main">

        {/* LEFT: ANNOUNCEMENTS */}
        <div className="dashboard-left">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faBullhorn} /> Announcements
          </h2>

          <div className="announcement-item">
            <div className="announcement-date">
              <span>31 Dec</span>
              <small>21:37</small>
            </div>
            <div className="announcement-content">
              <h4>Semester Registration Notice (Jan – June)</h4>
              <p>Registrar Office</p>
            </div>
          </div>

          <div className="announcement-item">
            <div className="announcement-date">
              <span>29 Dec</span>
              <small>10:28</small>
            </div>
            <div className="announcement-content">
              <h4>Supplementary Exam Registration</h4>
              <p>Academic Division</p>
            </div>
          </div>

          <div className="announcement-item">
            <div className="announcement-date">
              <span>23 Dec</span>
              <small>17:17</small>
            </div>
            <div className="announcement-content">
              <h4>Changes to Academic Progression Rules</h4>
              <p>University Senate</p>
            </div>
          </div>
        </div>

        {/* RIGHT: SIDE PANELS */}
        <div className="dashboard-right">

          {/* Upcoming Classes */}
          <div className="dashboard-box">
            <h3>
              <FontAwesomeIcon icon={faCalendar} /> Upcoming Classes
            </h3>

            <div className="class-item">
              <strong>Physics</strong>
              <span>Today · 6:00 PM</span>
            </div>

            <div className="class-item">
              <strong>Chemistry</strong>
              <span>Tomorrow · 4:30 PM</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-box">
            <h3>Quick Actions</h3>

            <button className="action-btn primary">
              <FontAwesomeIcon icon={faBookOpen} /> Go to Classes
            </button>

            <button className="action-btn secondary">
              <FontAwesomeIcon icon={faClipboardList} /> View Assignments
            </button>

            <button className="action-btn light">
              <FontAwesomeIcon icon={faRobot} /> NexDS AI Assistant
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
