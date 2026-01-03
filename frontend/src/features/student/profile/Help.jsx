import React, { useState } from "react";
import { APP_VERSION } from "../../../config/appConfig";
import "./help.css";

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p>
          Learn how to use the Learning Management System effectively and find
          solutions to common student problems.
        </p>
      </div>

      {/* SECTION 1 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(0)}>
          What is this Learning Management System?
        </button>
        {openIndex === 0 && (
          <div className="help-content">
            <p>
              This Learning Management System (LMS) is a centralized academic
              platform designed to manage classes, study materials,
              assignments, assessments, announcements, and communication in
              one place.
            </p>
            <p>
              It eliminates the need to use multiple tools and allows students
              to focus on learning through a single, well-structured system.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(1)}>
          How does this LMS solve student problems?
        </button>
        {openIndex === 1 && (
          <div className="help-content">
            <p>
              The LMS helps prevent missed deadlines, lost materials, and
              unclear communication by organizing academic content with
              clear structure and visibility.
            </p>
            <p>
              Students can track assignments, view announcements, access
              recordings, and monitor progress in a consistent way.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(2)}>
          How should I use the dashboard?
        </button>
        {openIndex === 2 && (
          <div className="help-content">
            <p>
              The dashboard highlights upcoming classes, pending assignments,
              recent announcements, and learning progress.
            </p>
            <p>
              Checking it daily helps students stay organized and avoid
              last-minute academic pressure.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 4 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(3)}>
          How do assignments, tests, and materials work?
        </button>
        {openIndex === 3 && (
          <div className="help-content">
            <p>
              Teachers upload materials, assignments, and tests according to
              the syllabus. Each item includes clear instructions and
              deadlines.
            </p>
            <p>
              Students can submit work, view status updates, and review
              feedback once results are published.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 5 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(4)}>
          How can I communicate with teachers?
        </button>
        {openIndex === 4 && (
          <div className="help-content">
            <p>
              Communication tools such as announcements, messages, and the
              question section allow structured interaction with teachers.
            </p>
            <p>
              All communication remains organized and accessible for future
              reference.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 6 */}
      <div className="help-item">
        <button className="help-title" onClick={() => toggleSection(5)}>
          What should I do if I face technical issues?
        </button>
        {openIndex === 5 && (
          <div className="help-content">
            <p>
              Refresh the page and check your internet connection first.
            </p>
            <p>
              If the issue continues, contact your institution’s technical
              support team with clear details.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER (HELP PAGE ONLY) */}
      <div className="help-footer">
        <p>
          Version {APP_VERSION} · Made with ❤️ · Developed by
          <strong> Nadeesha D Shalom</strong>
        </p>
      </div>
    </div>
  );
};

export default Help;
