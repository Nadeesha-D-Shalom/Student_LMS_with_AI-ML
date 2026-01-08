import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import robotImage from "../../assets/images/home/login.png";
import InfoModal from "./InfoModal";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [typing, setTyping] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isValid, setIsValid] = useState(false);

  /* IMPORTANT:
     Signup is blocked → no success state */
  const [success, setSuccess] = useState(false);

  /* =========================
     PASSWORD STRENGTH
  ========================= */
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "strong";
    return "medium";
  };

  /* =========================
     VALIDATION
  ========================= */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required.";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
    setTyping(true);
    setSuccess(false);

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    clearTimeout(window.__signupTyping);
    window.__signupTyping = setTimeout(() => {
      setTyping(false);
    }, 600);
  };

  useEffect(() => {
    validate();
  }, [validate]);

  /* =========================
     SUBMIT (BLOCKED SIGNUP)
  ========================= */
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validate()) return;

    /* BLOCK REGISTRATION */
    setSuccess(false);
    setShowPopup(true);
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-shell">

          {/* LEFT */}
          <div className="auth-left">
            <div className="auth-brand">Student LMS AI</div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Please Contact Insitite Admin to Register to the LMS..!
            </p>

            <form className="auth-form" onSubmit={onSubmit} noValidate>
              {/* NAME */}
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your name"
                />
                {(touched.name || submitted) && errors.name && (
                  <div className="auth-error">{errors.name}</div>
                )}
              </div>

              {/* EMAIL */}
              <div className="auth-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                />
                {(touched.email || submitted) && errors.email && (
                  <div className="auth-error">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="auth-field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Create a password"
                />

                {form.password && (
                  <div className={`password-strength ${passwordStrength}`}>
                    {passwordStrength.toUpperCase()}
                  </div>
                )}

                {(touched.password || submitted) && errors.password && (
                  <div className="auth-error">{errors.password}</div>
                )}
              </div>

              <button
                className="auth-primary-btn"
                type="submit"
                disabled={!isValid}
              >
                Sign Up
              </button>

              <div className="auth-footer">
                <span>Already have an account?</span>{" "}
                <Link to="/login">Login</Link>
              </div>
            </form>
          </div>

          {/* RIGHT */}
          <div className="auth-right">
            <div
              className={`robot-stage
                ${typing ? "typing" : ""}
                ${(submitted && Object.keys(errors).length) ? "error" : ""}
                ${success ? "success" : ""}
              `}
            >
              <div className="robot-bg" />
              <img
                src={robotImage}
                alt="AI Assistant Robot"
                className="robot-image"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ERROR / RESTRICTION MODAL */}
      <InfoModal
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
};

export default Signup;
