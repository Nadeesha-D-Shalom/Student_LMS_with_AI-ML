import React from "react";
import "./home.css";
import { useScrollReveal } from "../../utils/useScrollReveal";

const Footer = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <footer
      ref={ref}
      className={`footer reveal ${visible ? "visible" : ""}`}
    >
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="footer-title">Student LMS AI</h3>
          <p className="footer-description">
            Empowering the next generation of learners with AI-driven education.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="https://twitter.com" aria-label="Twitter">𝕏</a>
            <a href="https://facebook.com" aria-label="Facebook">f</a>
            <a href="https://instagram.com" aria-label="Instagram">📷</a>
            <a href="https://linkedin.com" aria-label="LinkedIn">in</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-text">
            © {new Date().getFullYear()} Student LMS AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
