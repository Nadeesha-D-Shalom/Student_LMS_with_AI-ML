import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import robotImage from "../../assets/images/home/login.png";
import { apiFetch } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { user, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (!loading && user) {
      window.location.replace("/student");
    }
  }, [user, loading]);

  const onChange = (e) => {
    setTyping(true);
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");

    clearTimeout(window.__typingTimer);
    window.__typingTimer = setTimeout(() => {
      setTyping(false);
    }, 600);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      localStorage.setItem("lms_token", data.token);

      // Reload once so AuthContext re-runs
      window.location.replace("/student");
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        setError("Invalid email or password.");
      } else {
        setError(err.message);
      }
    }
  };

  // Prevent flicker while checking session
  if (loading) {
    return null;
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">

        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-brand">Student LMS AI</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to continue your learning experience.
          </p>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-primary-btn" type="submit">
              Login
            </button>

            <div className="auth-footer">
              <span>Don’t have an account?</span>{" "}
              <Link to="/signup">Create one</Link>
            </div>
          </form>
        </div>

        {/* RIGHT – ROBOT */}
        <div className="auth-right">
          <div
            className={`robot-stage ${typing ? "typing" : ""} ${
              error ? "error" : ""
            }`}
          >
            <div className="robot-bg" />
            <img
              src={robotImage}
              alt="AI Assistant Robot"
              className="robot-image"
            />
            {error && (
              <div className="robot-bubble">
                No. Incorrect user or password. Check them.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
