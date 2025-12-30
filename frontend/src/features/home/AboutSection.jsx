import React from "react";
import "./home.css";
import { useScrollReveal } from "../../utils/useScrollReveal";

const AboutSection = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`about-section reveal ${visible ? "visible" : ""}`}
      id="about"
    >

      <div className="about-container">
        <div className="hero-badge">Discover Our Story</div>
        <h2>About Our AI-Powered Learning Platform</h2>
        <p>
          Student LMS AI is a next-generation platform that seamlessly integrates advanced artificial intelligence with modern educational practices. Designed for students, educators, and lifelong learners, our system delivers personalized learning experiences with unparalleled accuracy, speed, and clarity.
        </p>
        <div className="about-features">
          <div className="feature-card">
            <h3>Intelligent Tutoring</h3>
            <p>AI-driven assistants that adapt to your learning style and provide real-time feedback.</p>
          </div>
          <div className="feature-card">
            <h3>Collaborative Tools</h3>
            <p>Seamless integration for group projects, discussions, and shared resources.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;