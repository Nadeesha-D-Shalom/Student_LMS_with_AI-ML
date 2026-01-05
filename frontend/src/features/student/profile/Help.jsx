import React, { useState } from "react";
import { APP_VERSION } from "../../../config/appConfig";
import "./help.css";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const helpSections = [
    {
      title: "What is this Learning Management System?",
      content: [
        "This Learning Management System (LMS) is a centralized academic platform designed to manage classes, study materials, assignments, assessments, announcements, and communication in one place.",
        "It helps students focus on learning without switching between multiple tools."
      ]
    },
    {
      title: "How does this LMS solve student problems?",
      content: [
        "The LMS prevents missed deadlines, lost materials, and unclear communication by organizing all academic activities clearly.",
        "Students can track progress, deadlines, and updates from a single dashboard."
      ]
    },
    {
      title: "How should I use the dashboard?",
      content: [
        "The dashboard shows upcoming classes, pending assignments, announcements, and learning progress.",
        "Checking it daily helps avoid last-minute academic pressure."
      ]
    },
    {
      title: "How do assignments, tests, and materials work?",
      content: [
        "Teachers upload materials, assignments, and tests according to the syllabus.",
        "Students can submit work, track status, and review feedback once published."
      ]
    },
    {
      title: "How can I communicate with teachers?",
      content: [
        "Announcements, messages, and the question section allow structured communication.",
        "All messages remain organized for future reference."
      ]
    },
    {
      title: "What should I do if I face technical issues?",
      content: [
        "First, refresh the page and check your internet connection.",
        "If the issue continues, contact your institution’s technical support team with details."
      ]
    }
  ];

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p>
          Guidance on using the Learning Management System efficiently and
          resolving common student issues.
        </p>
      </div>

      <div className="help-list">
        {helpSections.map((section, index) => (
          <div
            key={index}
            className={`help-item ${openIndex === index ? "active" : ""}`}
          >
            <button
              className="help-title"
              onClick={() => toggleSection(index)}
            >
              <span>{section.title}</span>
              <span className="help-icon">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {openIndex === index && (
              <div className="help-content">
                {section.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="help-footer">
        <p>
          Version {APP_VERSION} · Made with ❤️ · Developed by <strong>Nadeesha D Shalom</strong>
        </p>
      </div>
    </div>
  );
};

export default Help;
