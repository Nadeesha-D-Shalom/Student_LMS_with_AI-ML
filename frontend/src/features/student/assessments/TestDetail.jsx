import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../../api/api";

const TestDetail = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(`/api/student/tests/${testId}`);
        setData(res);
      } catch (e) {
        setError("Failed to load test");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [testId]);

  const startTest = async () => {
    try {
      await apiFetch(`/api/student/tests/${testId}/start`, { method: "POST" });
      navigate(`/student/tests/${testId}/attempt`);
    } catch (e) {
      setError(e.message || "Unable to start test");
    }
  };

  if (loading) {
    return <div className="p-6 text-sm">Loading test...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">

      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-lg font-semibold">{data?.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Duration: {data?.duration_minutes} mins · Total Marks: {data?.total_marks}
        </p>

        {error && (
          <div className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-sm font-semibold">Instructions</h2>
        <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
          {data?.description || "No instructions provided."}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            onClick={startTest}
            className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetail;