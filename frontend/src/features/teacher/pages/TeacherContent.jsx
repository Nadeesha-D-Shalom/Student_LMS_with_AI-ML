import React, { useState } from "react";
import "./teacherContent.css";

export default function TeacherContent() {
  /* ================= CLASSES ================= */
  const teacherClasses = [
    { id: "ict-grade-10", subject: "ICT", grade: 10 },
    { id: "physics-grade-12", subject: "Physics", grade: 12 }
  ];

  const [selectedClass, setSelectedClass] = useState("");

  /* ================= NOTICES ================= */
  const [noticeText, setNoticeText] = useState("");
  const [notices, setNotices] = useState([]);

  /* ================= WEEKS ================= */
  const [weekTitle, setWeekTitle] = useState("");
  const [weeks, setWeeks] = useState([]);

  const [material, setMaterial] = useState({
    file: null,
    link: ""
  });

  /* ================= HANDLERS ================= */

  const addNotice = () => {
    if (!noticeText || !selectedClass) return;

    setNotices((prev) => [
      {
        id: Date.now(),
        classId: selectedClass,
        text: noticeText,
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);

    setNoticeText("");
  };

  const addWeek = () => {
    if (!weekTitle || !selectedClass) return;

    setWeeks((prev) => [
      {
        id: Date.now(),
        classId: selectedClass,
        title: weekTitle,
        items: []
      },
      ...prev
    ]);

    setWeekTitle("");
  };

  const addMaterialToWeek = (weekId) => {
    if (!material.file && !material.link) return;

    setWeeks((prev) =>
      prev.map((w) =>
        w.id === weekId
          ? {
              ...w,
              items: [
                ...w.items,
                {
                  id: Date.now(),
                  name: material.file
                    ? material.file.name
                    : material.link,
                  type: material.file ? "file" : "link"
                }
              ]
            }
          : w
      )
    );

    setMaterial({ file: null, link: "" });
  };

  /* ================= FILTERED ================= */
  const filteredNotices = notices.filter(
    (n) => n.classId === selectedClass
  );

  const filteredWeeks = weeks.filter(
    (w) => w.classId === selectedClass
  );

  return (
    <div className="teacher-content-page">
      <h2>Materials & Notices</h2>

      {/* ================= CLASS SELECT ================= */}
      <div className="class-selector">
        <label>Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select class</option>
          {teacherClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.subject} — Grade {c.grade}
            </option>
          ))}
        </select>
      </div>

      {/* ================= NOTICES ================= */}
      {selectedClass && (
        <div className="notice-section">
          <h3>Notices</h3>

          <textarea
            placeholder="Write notice for this class..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
          />

          <button
            className="teacher-primary-btn"
            onClick={addNotice}
          >
            Add Notice
          </button>

          {filteredNotices.map((n) => (
            <div key={n.id} className="notice-card">
              <div className="notice-date">{n.date}</div>
              <div>{n.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ================= WEEK CREATION ================= */}
      {selectedClass && (
        <div className="week-create">
          <h3>Add Week / Date Range</h3>
          <input
            placeholder="Week 1 or 10 February – 16 February"
            value={weekTitle}
            onChange={(e) => setWeekTitle(e.target.value)}
          />
          <button
            className="teacher-primary-btn"
            onClick={addWeek}
          >
            Create Week
          </button>
        </div>
      )}

      {/* ================= WEEKS ================= */}
      {filteredWeeks.map((week) => (
        <div key={week.id} className="week-box">
          <div className="week-title">{week.title}</div>

          <div className="material-add">
            <input
              type="file"
              onChange={(e) =>
                setMaterial({ file: e.target.files[0], link: "" })
              }
            />
            <input
              placeholder="Or add link"
              value={material.link}
              onChange={(e) =>
                setMaterial({ link: e.target.value, file: null })
              }
            />
            <button
              className="teacher-secondary-btn"
              onClick={() => addMaterialToWeek(week.id)}
            >
              Add
            </button>
          </div>

          <ul className="material-list">
            {week.items.map((i) => (
              <li key={i.id} className="material-item">
                {i.type === "file" ? "📄" : "🔗"} {i.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

