import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faBell,
  faChevronDown,
  faChevronRight,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";

const API =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function ClassWorkspace() {
  const { classId } = useParams();

  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [weekNotes, setWeekNotes] = useState([]);
  const [openWeeks, setOpenWeeks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      apiFetch(`/api/student/materials?class_id=${classId}`),
      apiFetch(`/api/student/notices`),
      apiFetch(`/api/student/weeks/notes?class_id=${classId}`)
    ])
      .then(([materialsRes, noticesRes, weekNotesRes]) => {
        setMaterials(materialsRes.items || []);
        setWeekNotes(weekNotesRes.items || []);

        setNotices(
          (noticesRes.items || []).filter(
            n =>
              n.class_id === null ||
              Number(n.class_id) === Number(classId)
          )
        );
      })
      .finally(() => setLoading(false));
  }, [classId]);

  const openFile = (fileUrl) => {
    if (!fileUrl) return;
    window.open(`${API}${fileUrl}`, "_blank", "noopener,noreferrer");
  };

  const getWeekNote = (weekTitle) =>
    weekNotes.find(w => w.week_title === weekTitle)?.note || "";

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

      {/* NOTICES */}
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

      {/* MATERIALS */}
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
                {/* WEEK HEADER */}
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

                {/* WEEK CONTENT */}
                {isOpen && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* WEEK NOTE */}
                    {getWeekNote(week) && (
                      <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-yellow-600 mt-0.5"
                        />
                        <div className="text-sm text-gray-800">
                          {getWeekNote(week)}
                        </div>
                      </div>
                    )}

                    {/* FILE LIST */}
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
