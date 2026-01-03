import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faGauge,
  faBook,
  faVideo,
  faFileLines,
  faClipboardList,
  faChartBar,
  faComments,
  faQuestionCircle,
  faBullhorn,
  faCalendar,
  faListCheck,
  faChartLine,
  faUser,
  faGear,
  faCircleQuestion,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [openSection, setOpenSection] = useState("learning");

  const toggleSection = (section) => {
    setOpenSection(section);
  };

  return (
    <aside className="student-sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <h2>LMS</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* AI */}
        <div className="nav-section">
          <p className="nav-title">AI ASSISTANT</p>
          <ul>
            <li>
              <a href="/ai" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faRobot} />
                <span>NexDS AI</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Learning */}
        <div className="nav-section">
          <p
            className="nav-title clickable"
            onClick={() => toggleSection("learning")}
          >
            LEARNING
          </p>

          {openSection === "learning" && (
            <ul>
              <li>
                <NavLink to="/student/dashboard">
                  <FontAwesomeIcon icon={faGauge} />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/classes">
                  <FontAwesomeIcon icon={faBook} />
                  <span>My Classes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/live-classes">
                  <FontAwesomeIcon icon={faVideo} />
                  <span>Live Classes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/recordings">
                  <FontAwesomeIcon icon={faFileLines} />
                  <span>Recorded Lessons</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Assessments */}
        <div className="nav-section">
          <p
            className="nav-title clickable"
            onClick={() => toggleSection("assessments")}
          >
            ASSESSMENTS
          </p>

          {openSection === "assessments" && (
            <ul>
              <li>
                <NavLink to="/student/assignments">
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Assignments</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/tests">
                  <FontAwesomeIcon icon={faChartBar} />
                  <span>Quizzes / Tests</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/results">
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Results</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Communication */}
        <div className="nav-section">
          <p
            className="nav-title clickable"
            onClick={() => toggleSection("communication")}
          >
            COMMUNICATION
          </p>

          {openSection === "communication" && (
            <ul>
              <li>
                <NavLink to="/student/messages">
                  <FontAwesomeIcon icon={faComments} />
                  <span>Messages</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/questions">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  <span>Ask a Question</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/announcements">
                  <FontAwesomeIcon icon={faBullhorn} />
                  <span>Announcements</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Planning */}
        <div className="nav-section">
          <p
            className="nav-title clickable"
            onClick={() => toggleSection("planning")}
          >
            PLANNING
          </p>

          {openSection === "planning" && (
            <ul>
              <li>
                <NavLink to="/student/calendar">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Calendar</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/todo">
                  <FontAwesomeIcon icon={faListCheck} />
                  <span>To-Do List</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/student/progress">
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Progress</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <ul>
          <li>
            <NavLink to="/student/profile">
              <FontAwesomeIcon icon={faUser} />
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/settings">
              <FontAwesomeIcon icon={faGear} />
              <span>Settings</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/help">
              <FontAwesomeIcon icon={faCircleQuestion} />
              <span>Help</span>
            </NavLink>
          </li>
          <li className="logout">
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
