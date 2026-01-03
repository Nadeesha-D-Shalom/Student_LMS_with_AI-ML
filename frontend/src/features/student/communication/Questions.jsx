import React, { useEffect, useState } from "react";
import "./questions.css";

const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [questions] = useState([]);

  useEffect(() => {
    /*
      BACKEND (LATER)
      GET /api/student/questions
    */
    setLoading(false);
  }, []);

  return (
    <div className="questions-page">
      <div className="page-header">
        <h1>Ask a Question</h1>
        <p>Submit your doubts and view teacher responses.</p>
      </div>

      <div className="question-form">
        <textarea
          placeholder="Type your question here..."
          disabled
        />
        <button disabled>Submit Question</button>
        <p className="hint">
          Question submission will be enabled once backend is connected.
        </p>
      </div>

      {loading && (
        <div className="page-loading">
          Loading questions...
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="empty-state">
          <p>No questions submitted yet.</p>
        </div>
      )}
    </div>
  );
};

export default Questions;
