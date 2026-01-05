import React, { useState } from "react";
import "./teacherTests.css";

export default function TeacherTests() {
  const academicYear = "2026";

  const teacherClasses = [
    { id: "ict-grade-10", subject: "ICT", grade: 10, students: 42 },
    { id: "physics-grade-12", subject: "Physics", grade: 12, students: 31 }
  ];

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [tests, setTests] = useState([]);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    type: "",
    duration: "",
    totalMarks: "",
    dueDate: ""
  });

  const toggleClass = (id) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: false }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((k) => {
      if (!form[k]) newErrors[k] = true;
    });
    if (selectedClasses.length === 0) newErrors.classes = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return false;
    }
    return true;
  };

  const createTest = () => {
    if (!validate()) return;

    setTests((prev) => [
      {
        id: Date.now(),
        ...form,
        academicYear,
        targets: selectedClasses,
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);

    setForm({
      title: "",
      type: "",
      duration: "",
      totalMarks: "",
      dueDate: ""
    });
    setSelectedClasses([]);
    setErrors({});
  };

  return (
    <div className="teacher-tests-page">
      <h2>Tests</h2>
      <p className="subtitle">
        Academic Year {academicYear} • Create once and assign to multiple classes
      </p>

      {/* ================= CLASS SELECT ================= */}
      <div className={`test-class-box ${errors.classes ? "error-box" : ""}`}>
        <h3>Select Classes</h3>
        {teacherClasses.map((cls) => (
          <label key={cls.id} className="test-class-item">
            <input
              type="checkbox"
              checked={selectedClasses.includes(cls.id)}
              onChange={() => toggleClass(cls.id)}
            />
            {cls.subject} — Grade {cls.grade} ({cls.students} students)
          </label>
        ))}
      </div>

      {/* ================= FORM ================= */}
      <div className={`test-form ${shake ? "shake" : ""}`}>
        <h3>Create Test</h3>

        <input
          name="title"
          placeholder="Test title"
          value={form.title}
          onChange={handleChange}
          className={errors.title ? "input-error" : ""}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className={errors.type ? "input-error" : ""}
        >
          <option value="">Select test type</option>
          <option value="mcq">MCQ (Online)</option>
          <option value="paper">Paper Upload (PDF)</option>
        </select>

        <input
          name="duration"
          placeholder="Duration (minutes)"
          value={form.duration}
          onChange={handleChange}
          className={errors.duration ? "input-error" : ""}
        />

        <input
          name="totalMarks"
          placeholder="Total marks"
          value={form.totalMarks}
          onChange={handleChange}
          className={errors.totalMarks ? "input-error" : ""}
        />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className={errors.dueDate ? "input-error" : ""}
        />

        {Object.keys(errors).length > 0 && (
          <div className="form-error-text">
            Please fill all required fields and select at least one class.
          </div>
        )}

        <button
          className="teacher-primary-btn"
          onClick={createTest}
        >
          Create Test
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="test-list">
        <h3>Published Tests</h3>

        {tests.length === 0 ? (
          <p className="empty">No tests created yet.</p>
        ) : (
          tests.map((t) => (
            <div key={t.id} className="test-card">
              <div className="test-title">{t.title}</div>
              <div className="test-desc">
                {t.type.toUpperCase()} • {t.duration} mins • {t.totalMarks} marks
              </div>
              <div className="test-meta">
                Due: {t.dueDate} • {t.targets.length} class(es)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
