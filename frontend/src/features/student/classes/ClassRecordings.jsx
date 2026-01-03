import React from "react";
import "./classRecordings.css";

const recordings = [
  { id: 1, title: "Lecture 08 – Trees", date: "10 May 2025" },
  { id: 2, title: "Lecture 09 – Recursion", date: "17 May 2025" }
];

const ClassRecordings = () => {
  return (
    <div className="recordings-page">
      <h2>Recorded Lessons</h2>

      {recordings.map((r) => (
        <div key={r.id} className="recording-item">
          <span>{r.title}</span>
          <small>{r.date}</small>
          <button>Play</button>
        </div>
      ))}
    </div>
  );
};

export default ClassRecordings;
