import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faVideo,
  faClipboardList,
  faBell
} from "@fortawesome/free-solid-svg-icons";
import AskAICard from "../assistant/AskAICard";
import { apiFetch } from "../../../api/api";

const iconByType = (type) => {
  const t = (type || "").toUpperCase();
  if (t === "VIDEO") return faVideo;
  return faFilePdf;
};

const ClassWorkspace = () => {
  const { classId, gradeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch(
          `/api/student/classes/${classId}/grade/${gradeId}/workspace`
        );
        setData(res);
      } catch {
        setError("Unable to load workspace");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId, gradeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="flex gap-6 px-6 py-6 max-w-7xl mx-auto">
      {/* MAIN */}
      <div className="flex-1 space-y-8">
        {/* HEADER */}
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Class Workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Grade {gradeId} · Class ID {classId}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* NOTICES */}
        <section className="bg-yellow-100 border rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 flex items-center  gap-2 mb-4">
            <FontAwesomeIcon icon={faBell} />
            Notices
          </h3>

          {!data?.notices || data.notices.length === 0 ? (
            <div className="text-sm text-gray-500">
              No notices available at the moment.
            </div>
          ) : (
            <div className="space-y-3">
              {data.notices.map((n) => (
                <div
                  key={n.id}
                  className="border rounded-lg px-4 py-3 bg-gray-50"
                >
                  <div className="font-medium text-gray-800">
                    {n.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {n.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MATERIALS */}
        <section className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">
            Study Materials
          </h3>

          {!data?.materials || data.materials.length === 0 ? (
            <div className="text-sm text-gray-500">
              No study materials uploaded yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {data.materials.map((m) => (
                <a
                  key={m.id}
                  href={m.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 border rounded-lg px-4 py-3 hover:bg-gray-50 transition"
                >
                  <FontAwesomeIcon
                    icon={iconByType(m.material_type)}
                    className="text-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {m.title}
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* ASSIGNMENTS */}
        <section className="bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 bg-gray-200 flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faClipboardList} />
            Assignments
          </h3>

          {!data?.assignments || data.assignments.length === 0 ? (
            <div className="text-sm text-gray-500">
              No assignments published yet.
            </div>
          ) : (
            <div className="space-y-3">
              {data.assignments.map((a) => (
                <div
                  key={a.id}
                  onClick={() =>
                    navigate(
                      `/student/classes/${classId}/grade/${gradeId}/assignments/${a.id}`
                    )
                  }
                  className="cursor-pointer border rounded-lg px-4 py-4 hover:bg-gray-50 transition flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {a.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Due {a.due_date} at {a.due_time}
                    </div>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* SIDEBAR */}
      <div className="w-80 hidden lg:block">
        <AskAICard />
      </div>
    </div>
  );
};

export default ClassWorkspace;
