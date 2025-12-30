import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">Student LMS AI</div>

        <div className="navbar-right">
          <nav className={`navbar-links ${open ? "open" : ""}`}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <div
            className="menu-toggle"
            onClick={() => setOpen(!open)}
          >
            ☰
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;