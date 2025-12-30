import React from "react";
import "./home.css";
import heroImage from "../../assets/images/home/hero.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faGraduationCap,
  faChartLine,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  return (
    <section className="hero-modern" id="home">
      <div className="hero-modern-container">

        {/* LEFT CONTENT */}
        <div className="hero-left">
          <span className="hero-badge typewriter">
            <FontAwesomeIcon icon={faRobot} />
            Next-Generation AI Learning Platform
          </span>

          <h1 className="hero-title">
            Master Your Studies with{" "}
            <span className="hero-highlight">AI-Powered Learning</span>
          </h1>

          <p className="hero-description">
            A smart Learning Management System designed to support students
            through personalized learning paths, syllabus-aligned AI assistance,
            and structured academic guidance.
          </p>

          <div className="hero-cta">
            <button className="primary-btn">
              <FontAwesomeIcon icon={faGraduationCap} />
              Start Learning Now
            </button>
          </div>

          <div className="hero-stats-inline">
            <div>
              <strong>
                <FontAwesomeIcon icon={faUserCheck} />
                5,000+
              </strong>
              <span>Active Students</span>
            </div>

            <div>
              <strong>
                <FontAwesomeIcon icon={faChartLine} />
                95%
              </strong>
              <span>Success Rate</span>
            </div>

            <div>
              <strong>
                <FontAwesomeIcon icon={faRobot} />
                AI
              </strong>
              <span>Academic Mentor</span>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-right">
          <div className="hero-image-card">
            <img src={heroImage} alt="AI Learning Platform" />

            <div className="floating-card progress-card">
              <FontAwesomeIcon icon={faChartLine} />
              78% Complete
              <span>Learning Progress</span>
            </div>

            <div className="floating-card ai-card">
              <FontAwesomeIcon icon={faRobot} />
              AI Mentor Active
              <span>Personalized Guidance</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
