import React, { useState } from "react";
import "./teacherAssignments.css";

export default function TeacherAssignments() {
  const academicYear = "2026";

  const teacherClasses = [
    { id: "ict-grade-10", subject: "ICT", grade: 10, students: 42 },
    { id: "physics-grade-12", subject: "Physics", grade: 12, students: 31 }
  ];

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
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
  };

  const createAssignment = () => {
    if (
      !form.title ||
      !form.dueDate ||
      selectedClasses.length === 0
    )
      return;

    setAssignments((prev) => [
      {
        id: Date.now(),
        ...form,
        academicYear,
        targets: selectedClasses,
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);

    setForm({ title: "", description: "", dueDate: "" });
    setSelectedClasses([]);
  };

  return (
    <div className="teacher-assignments-page">
      <h2>Assignments</h2>
      <p className="subtitle">
        Academic Year {academicYear} • Create once, assign to multiple classes
      </p>

      {/* CLASS SELECT */}
      <div className="assign-class-box">
        <h3>Select Classes</h3>
        {teacherClasses.map((cls) => (
          <label key={cls.id} className="assign-class-item">
            <input
              type="checkbox"
              checked={selectedClasses.includes(cls.id)}
              onChange={() => toggleClass(cls.id)}
            />
            {cls.subject} — Grade {cls.grade} ({cls.students} students)
          </label>
        ))}
      </div>

      {/* FORM */}
      <div className="assign-form">
        <input
          name="title"
          placeholder="Assignment title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description / Instructions"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <button
          className="teacher-primary-btn"
          onClick={createAssignment}
        >
          Create Assignment
        </button>
      </div>

      {/* LIST */}
      <div className="assign-list">
        <h3>Published Assignments</h3>

        {assignments.length === 0 ? (
          <p className="empty">No assignments created yet.</p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="assign-card">
              <div className="assign-title">{a.title}</div>
              <div className="assign-desc">{a.description}</div>
              <div className="assign-meta">
                Due: {a.dueDate} • {a.targets.length} class(es)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
