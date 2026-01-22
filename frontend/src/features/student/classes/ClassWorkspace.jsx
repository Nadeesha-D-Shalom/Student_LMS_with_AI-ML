import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faBell,
  faChevronDown,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";

const API =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function ClassWorkspace() {
  const { classId, gradeId } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [openWeeks, setOpenWeeks] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  const loadWorkspaceData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        materialsRes,
        noticesRes,
        assignmentsRes
      ] = await Promise.all([
        apiFetch(`/api/student/materials?class_id=${classId}`),
        apiFetch(`/api/student/notices`),
        apiFetch(`/api/student/assignments?class_id=${classId}`)
      ]);

      setMaterials(materialsRes.items || []);
      setAssignments(assignmentsRes.items || []);

      setNotices(
        (noticesRes.items || []).filter(
          n =>
            n.class_id === null ||
            Number(n.class_id) === Number(classId)
        )
      );
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData]);

  /* ================= HELPERS ================= */
  const openFile = (fileUrl) => {
    if (!fileUrl) return;
    window.open(`${API}${fileUrl}`, "_blank", "noopener,noreferrer");
  };

  const materialsByWeek = materials.reduce((acc, m) => {
    const week = m.week_title || "General";
    if (!acc[week]) acc[week] = [];
    acc[week].push(m);
    return acc;
  }, {});

  const toggleWeek = (week) => {
    setOpenWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  if (loading) {
    return <div className="p-6 text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Class Workspace</h1>

      {/* ================= NOTICES ================= */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faBell} />
          Notices
        </h3>

        {notices.length === 0 ? (
          <div className="text-sm text-gray-600">
            No notices available.
          </div>
        ) : (
          notices.map(n => (
            <div
              key={n.id}
              className="bg-white rounded-lg p-4 mb-3 border"
            >
              <div className="text-xs text-gray-500 mb-1">
                {n.created_at
                  ? new Date(n.created_at).toLocaleString()
                  : ""}
              </div>
              <div className="text-sm">{n.content}</div>
            </div>
          ))
        )}
      </section>

      {/* ================= ASSIGNMENTS ================= */}
      <section className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">
          Assignments
        </h3>

        {assignments.length === 0 ? (
          <div className="text-sm text-gray-600">
            No assignments available.
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map(a => (
              <button
                key={a.id}
                onClick={() =>
                  navigate(
                    `/student/classes/${classId}/grade/${gradeId}/assignments/${a.id}`
                  )
                }
                className="w-full text-left border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-medium text-gray-900">
                      {a.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      Due:{" "}
                      {a.due_date
                        ? new Date(a.due_date).toLocaleDateString()
                        : "-"}{" "}
                      · {a.due_time || ""}
                    </div>
                  </div>

                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    Submit
                  </span>
                </div>
              </button>
            ))}

          </div>
        )}
      </section>

      {/* ================= MATERIALS ================= */}
      <section className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-6 text-lg">
          Study Materials
        </h3>

        {Object.keys(materialsByWeek).length === 0 ? (
          <div className="text-sm text-gray-600">
            No materials uploaded.
          </div>
        ) : (
          Object.entries(materialsByWeek).map(([week, items]) => {
            const isOpen = openWeeks[week];

            return (
              <div
                key={week}
                className="border rounded-lg mb-4 overflow-hidden"
              >
                <button
                  onClick={() => toggleWeek(week)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
                >
                  <FontAwesomeIcon
                    icon={isOpen ? faChevronDown : faChevronRight}
                    className="text-gray-500"
                  />
                  <span className="font-medium">{week}</span>
                </button>

                {isOpen && (
                  <div className="p-4 space-y-4 bg-white">
                    {items.map(m => (
                      <button
                        key={m.id}
                        onClick={() => openFile(m.file_url)}
                        className="w-full flex items-center gap-3 border rounded-md p-3 hover:bg-gray-50 text-left"
                      >
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="text-red-600"
                        />
                        <span className="text-sm font-medium">
                          {m.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
