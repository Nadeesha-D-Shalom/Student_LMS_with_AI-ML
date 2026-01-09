import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const TestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/api/student/tests/${testId}/questions`);
        setQuestions(res.items || []);
      } catch (e) {
        setError(e.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [testId]);

  const selectAnswer = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const submitTest = async () => {
    setSubmitting(true);
    setError("");

    try {
      // Save all answers
      for (const q of questions) {
        const selected = answers[q.id];
        if (selected) {
          await apiFetch(`/api/student/tests/${testId}/answer`, {
            method: "POST",
            body: JSON.stringify({
              question_id: q.id,
              selected_option: selected
            })
          });
        }
      }

      // Submit test
      await apiFetch(`/api/student/tests/${testId}/submit`, {
        method: "POST"
      });

      navigate(`/student/tests/${testId}/result`);
    } catch (e) {
      setError(e.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-lg font-semibold">MCQ Test</h1>

      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="rounded-xl border bg-white p-5 space-y-3"
        >
          <div className="text-sm font-semibold">
            {idx + 1}. {q.question}
          </div>

          {["A", "B", "C", "D"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() => selectAnswer(q.id, opt)}
              />
              {q[`option_${opt.toLowerCase()}`]}
            </label>
          ))}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={submitTest}
          disabled={submitting}
          className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          {submitting ? "Submitting..." : "Submit Test"}
        </button>
      </div>
    </div>
  );
};

export default TestAttempt;
