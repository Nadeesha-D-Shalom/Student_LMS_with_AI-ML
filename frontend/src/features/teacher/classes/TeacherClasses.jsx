import React, { useState } from "react";
import TeacherClassCard from "./TeacherClassCard";
import "./teacherClasses.css";

export default function TeacherClasses() {
  const [classes] = useState([
    {
      id: "ict",
      subject: "ICT",
      grades: ["OL10", "OL11"]
    },
    {
      id: "physics",
      subject: "Physics",
      grades: ["AL12", "AL13"]
    }
  ]);

  return (
    <div className="teacher-classes-page">
      <h2 className="teacher-page-title">My Classes</h2>

      <div className="teacher-class-grid">
        {classes.map((cls) => (
          <TeacherClassCard key={cls.id} data={cls} />
        ))}
      </div>
    </div>
  );
}
