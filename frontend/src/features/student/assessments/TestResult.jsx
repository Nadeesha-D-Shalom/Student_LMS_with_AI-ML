import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const TestResult = () => {
  const { testId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/api/student/tests/${testId}/result`);
        setData(res);
      } catch (e) {
        setError(e.message || "Result not available");
      }
    };
    load();
  }, [testId]);

  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

  if (!data) {
    return <div className="p-6 text-sm">Loading result...</div>;
  }

  return (
    <div className="max-w-xl rounded-2xl border bg-white p-6">
      <h1 className="text-lg font-semibold">{data.title}</h1>
      <p className="mt-3 text-sm">
        Score: <b>{data.score}</b> / {data.total_marks}
      </p>
    </div>
  );
};

export default TestResult;
