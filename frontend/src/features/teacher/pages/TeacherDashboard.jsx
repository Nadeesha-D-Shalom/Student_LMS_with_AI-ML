import React from "react";
import { NavLink } from "react-router-dom";
import "./teacherDashboard.css";

export default function TeacherDashboard() {
  return (
    <div className="teacher-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Overview</h2>
        <p>Quick summary of your teaching activities</p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Classes</div>
          <div className="stat-value">4</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">128</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Assignments</div>
          <div className="stat-value">6</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Upcoming Tests</div>
          <div className="stat-value">2</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>

        <div className="quick-actions">
          <NavLink to="/teacher/classes" className="action-card">
            <div className="action-title">My Classes</div>
            <div className="action-desc">
              Add a new subject, grade, and schedule
            </div>
          </NavLink>

          <NavLink to="/teacher/content" className="action-card">
            <div className="action-title">Publish Material</div>
            <div className="action-desc">
              Upload weekly notes, PDFs, or links
            </div>
          </NavLink>

          <NavLink to="/teacher/assignments" className="action-card">
            <div className="action-title">Create Assignment</div>
            <div className="action-desc">
              Assign work to one or multiple classes
            </div>
          </NavLink>

          <NavLink to="/teacher/tests" className="action-card">
            <div className="action-title">Schedule Test</div>
            <div className="action-desc">
              Create MCQ or paper-based tests
            </div>
          </NavLink>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="dashboard-section">
        <h3>Recent Activity</h3>

        <div className="activity-list">
          <div className="activity-item">
            Assignment “ICT – Grade 10 – Week 3” created
          </div>
          <div className="activity-item">
            Material uploaded for Physics – Grade 12
          </div>
          <div className="activity-item">
            Notice published to ICT Grade 11
          </div>
        </div>
      </div>
    </div>
  );
}
