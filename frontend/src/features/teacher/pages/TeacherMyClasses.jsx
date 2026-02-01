import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../classes/teacherClasses.css";

export default function TeacherMyClasses() {
  const navigate = useNavigate();

  /* ================= SAMPLE CLASSES (IMPORTANT) ================= */
  const [classes, setClasses] = useState([
    {
      id: "ict-grade-10",
      subject: "ICT",
      grade: "10",
      location: "Online",
      startDate: "2025-01-15",
      startTime: "18:00",
      endTime: "20:00",
      startYear: "2025",
      startMonth: "January"
    },
    {
      id: "physics-grade-12",
      subject: "Physics",
      grade: "12",
      location: "Hall A",
      startDate: "2025-02-01",
      startTime: "16:30",
      endTime: "18:30",
      startYear: "2025",
      startMonth: "February"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    grade: "",
    location: "",
    startDate: "",
    startTime: "",
    endTime: "",
    startYear: "",
    startMonth: ""
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const grades = Array.from({ length: 13 }, (_, i) => i + 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) newErrors[key] = true;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return false;
    }
    return true;
  };

  const createClass = () => {
    if (!validate()) return;

    const newClass = {
      id: `${form.subject}-grade-${form.grade}`
        .toLowerCase()
        .replace(/\s+/g, "-"),
      ...form
    };

    setClasses((prev) => [...prev, newClass]);

    setForm({
      subject: "",
      grade: "",
      location: "",
      startDate: "",
      startTime: "",
      endTime: "",
      startYear: "",
      startMonth: ""
    });

    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="teacher-classes-page">
      <div className="teacher-classes-header">
        <h2 className="teacher-page-title">My Classes</h2>
        <button
          className="teacher-primary-btn"
          onClick={() => setShowForm(true)}
        >
          + Create Class
        </button>
      </div>

      {showForm && (
        <div className={`teacher-create-box ${shake ? "shake" : ""}`}>
          <div className="teacher-form-grid">
            {[
              ["subject", "Subject Name", "ICT / Physics"],
              ["location", "Location", "Hall A / Online"],
              ["startYear", "Academic Start Year", "2025"],
              ["startMonth", "Start Month", "January"]
            ].map(([name, label, placeholder]) => (
              <div key={name} className="teacher-form-row">
                <label>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={errors[name] ? "input-error" : ""}
                />
              </div>
            ))}

            <div className="teacher-form-row">
              <label>Grade</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className={errors.grade ? "input-error" : ""}
              >
                <option value="">Select Grade</option>
                {grades.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>

            {["startDate", "startTime", "endTime"].map((field) => (
              <div key={field} className="teacher-form-row">
                <label>
                  {field === "startDate"
                    ? "Start Date"
                    : field === "startTime"
                    ? "Start Time"
                    : "End Time"}
                </label>
                <input
                  type={field === "startDate" ? "date" : "time"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={errors[field] ? "input-error" : ""}
                />
              </div>
            ))}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="teacher-error-text">
              Please fill in all required fields.
            </div>
          )}

          <div className="teacher-form-actions">
            <button
              className="teacher-secondary-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button className="teacher-primary-btn" onClick={createClass}>
              Create Class
            </button>
          </div>
        </div>
      )}

      <div className="teacher-class-grid">
        {classes.map((cls) => (
          <div key={cls.id} className="teacher-class-card">
            <div className="teacher-class-title">
              {cls.subject} — Grade {cls.grade}
            </div>

            <div className="teacher-class-sub">
              {cls.location} | {cls.startTime} - {cls.endTime}
            </div>

            <div className="teacher-class-footer">
              Started: {cls.startDate} | Academic Year {cls.startYear}
            </div>

            {/* ROUTE FIXED HERE */}
            <button
              className="teacher-grade-btn"
              onClick={() =>
                navigate(`/teacher/classes/${cls.id}/grade/${cls.grade}`)
              }
            >
              Open Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
