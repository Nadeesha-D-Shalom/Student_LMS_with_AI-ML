import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBell,
  faTrash,
  faEdit,
  faSave,
  faUpload,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../../components/ConfirmModal";

export default function TeacherContent() {
  const [mode, setMode] = useState("MATERIALS");
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  // Notices
  const [notices, setNotices] = useState([]);
  const [noticeDraft, setNoticeDraft] = useState("");
  const [editingNotice, setEditingNotice] = useState(null);

  // Materials
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);
  const [weekInput, setWeekInput] = useState("");

  // Week notes (DB)
  const [weekNotes, setWeekNotes] = useState([]);
  // Week notes UI drafts per week_title
  const [noteDrafts, setNoteDrafts] = useState({});
  const [savingWeek, setSavingWeek] = useState(null);

  // Week rename
  const [renamingWeek, setRenamingWeek] = useState(null);
  const [weekRenameDraft, setWeekRenameDraft] = useState("");

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  /* -------------------- LOAD -------------------- */
  useEffect(() => {
    apiFetch("/api/teacher/classes").then(r => setClasses(r.items || []));
  }, []);

  useEffect(() => {
    if (!classId) return;

    apiFetch(`/api/teacher/notices?class_id=${classId}`).then(r =>
      setNotices(r.items || [])
    );

    apiFetch(`/api/teacher/materials?class_id=${classId}`).then(r =>
      setMaterials(r.items || [])
    );

    apiFetch(`/api/teacher/weeks/notes?class_id=${classId}`).then(r =>
      setWeekNotes(r.items || [])
    );
  }, [classId]);

  /* -------------------- GROUP BY WEEK -------------------- */
  const materialsByWeek = useMemo(() => {
    return materials.reduce((acc, m) => {
      const w = m.week_title || "General";
      if (!acc[w]) acc[w] = [];
      acc[w].push(m);
      return acc;
    }, {});
  }, [materials]);

  const weeks = useMemo(() => {
    // IMPORTANT: weeks come from materials only (your requirement)
    return Object.keys(materialsByWeek).sort();
  }, [materialsByWeek]);

  /* -------------------- WEEK NOTE HELPERS -------------------- */
  const getSavedNote = (weekTitle) =>
    weekNotes.find(w => w.week_title === weekTitle)?.note || "";

  const getDraftNote = (weekTitle) => {
    if (noteDrafts[weekTitle] !== undefined) return noteDrafts[weekTitle];
    return getSavedNote(weekTitle);
  };

  const refreshWeekNotes = async () => {
    const r = await apiFetch(`/api/teacher/weeks/notes?class_id=${classId}`);
    setWeekNotes(r.items || []);
  };

  const saveWeekNote = async (weekTitle) => {
    const note = (noteDrafts[weekTitle] ?? "").trim();

    setSavingWeek(weekTitle);
    try {
      await apiFetch("/api/teacher/weeks/note", {
        method: "PUT",
        body: JSON.stringify({
          class_id: Number(classId),
          week_title: weekTitle,
          note
        })
      });

      await refreshWeekNotes();

      // keep drafts in sync with saved
      setNoteDrafts(prev => ({
        ...prev,
        [weekTitle]: note
      }));
    } finally {
      setSavingWeek(null);
    }
  };

  /* -------------------- WEEK RENAME -------------------- */
  const refreshMaterials = async () => {
    const r = await apiFetch(`/api/teacher/materials?class_id=${classId}`);
    setMaterials(r.items || []);
  };

  const renameWeek = async (oldWeekTitle) => {
    const newTitle = weekRenameDraft.trim();
    if (!newTitle) return;

    await apiFetch("/api/teacher/weeks/rename", {
      method: "PUT",
      body: JSON.stringify({
        class_id: Number(classId),
        old_week_title: oldWeekTitle,
        new_week_title: newTitle
      })
    });

    setRenamingWeek(null);
    setWeekRenameDraft("");

    await refreshMaterials();
    await refreshWeekNotes();

    // move draft if existed
    setNoteDrafts(prev => {
      if (prev[oldWeekTitle] === undefined) return prev;
      const clone = { ...prev };
      clone[newTitle] = clone[oldWeekTitle];
      delete clone[oldWeekTitle];
      return clone;
    });
  };

  /* -------------------- MATERIAL UPLOAD -------------------- */
  const uploadMaterial = async () => {
    const wk = weekInput.trim();
    if (!wk || !file) return;

    const fd = new FormData();
    fd.append("class_id", classId);
    fd.append("week_title", wk);
    fd.append("file", file);

    await apiFetch("/api/teacher/materials", {
      method: "POST",
      body: fd
    });

    setFile(null);
    setWeekInput("");

    await refreshMaterials();
  };

  const askDelete = (text, action) => {
    setConfirmText(text);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  /* -------------------- NOTICES -------------------- */
  const refreshNotices = async () => {
    const r = await apiFetch(`/api/teacher/notices?class_id=${classId}`);
    setNotices(r.items || []);
  };

  const saveNotice = async () => {
    const content = noticeDraft.trim();
    if (!content) return;

    if (editingNotice) {
      await apiFetch(`/api/teacher/notices/${editingNotice.id}`, {
        method: "PUT",
        body: JSON.stringify({ content })
      });
      setEditingNotice(null);
    } else {
      await apiFetch("/api/teacher/notices", {
        method: "POST",
        body: JSON.stringify({
          class_id: Number(classId),
          content
        })
      });
    }

    setNoticeDraft("");
    await refreshNotices();
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Class Content</h2>

      {/* MODE SWITCH */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode("MATERIALS")}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
            mode === "MATERIALS" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          <FontAwesomeIcon icon={faBook} />
          Materials
        </button>

        <button
          onClick={() => setMode("NOTICES")}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${
            mode === "NOTICES" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          <FontAwesomeIcon icon={faBell} />
          Notices
        </button>
      </div>

      {/* CLASS SELECT */}
      <select
        className="w-full border rounded-lg px-3 py-2"
        value={classId}
        onChange={e => setClassId(e.target.value)}
      >
        <option value="">Select class</option>
        {classes.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* NOTICES */}
      {mode === "NOTICES" && classId && (
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <textarea
            value={noticeDraft}
            onChange={e => setNoticeDraft(e.target.value)}
            placeholder="Write notice..."
            className="w-full border rounded-md p-3"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={saveNotice}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {editingNotice ? "Save Notice" : "Publish Notice"}
            </button>

            {editingNotice && (
              <button
                onClick={() => {
                  setEditingNotice(null);
                  setNoticeDraft("");
                }}
                className="px-4 py-2 rounded-md border bg-white"
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>

          {notices.map(n => (
            <div
              key={n.id}
              className="border rounded-md p-3 flex justify-between items-start gap-3"
            >
              <div className="flex-1">{n.content}</div>

              <div className="flex gap-2">
                <button
                  className="text-blue-700"
                  onClick={() => {
                    setEditingNotice(n);
                    setNoticeDraft(n.content);
                  }}
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                <button
                  className="text-red-600"
                  onClick={() =>
                    askDelete("Delete notice?", async () => {
                      await apiFetch(`/api/teacher/notices/${n.id}`, {
                        method: "DELETE"
                      });
                      await refreshNotices();
                      setConfirmOpen(false);
                    })
                  }
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MATERIALS */}
      {mode === "MATERIALS" && classId && (
        <>
          {/* UPLOAD SECTION */}
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <input
              value={weekInput}
              onChange={e => setWeekInput(e.target.value)}
              placeholder="Week title"
              className="w-full border rounded-md p-3"
            />

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />

              <button
                onClick={uploadMaterial}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faUpload} />
                Upload
              </button>
            </div>
          </div>

          {/* WEEK CARDS */}
          {weeks.length === 0 ? (
            <div className="text-sm text-gray-600">
              No materials uploaded yet.
            </div>
          ) : (
            weeks.map(weekTitle => (
              <div key={weekTitle} className="bg-white border rounded-xl p-4 space-y-3">
                {/* WEEK HEADER + RENAME */}
                <div className="flex items-center gap-2">
                  {renamingWeek === weekTitle ? (
                    <>
                      <input
                        value={weekRenameDraft}
                        onChange={e => setWeekRenameDraft(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full"
                      />
                      <button
                        onClick={() => renameWeek(weekTitle)}
                        className="px-3 py-2 rounded-md bg-blue-600 text-white"
                        title="Save week title"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={() => {
                          setRenamingWeek(null);
                          setWeekRenameDraft("");
                        }}
                        className="px-3 py-2 rounded-md border bg-white"
                        title="Cancel"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-base">{weekTitle}</div>
                      <button
                        className="text-blue-700"
                        onClick={() => {
                          setRenamingWeek(weekTitle);
                          setWeekRenameDraft(weekTitle);
                        }}
                        title="Rename week"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </>
                  )}
                </div>

                {/* WEEK NOTE (THIS IS WHAT YOU ASKED) */}
                <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
                  <div className="text-sm font-medium text-gray-800">
                    Week note
                  </div>

                  <textarea
                    value={getDraftNote(weekTitle)}
                    onChange={e =>
                      setNoteDrafts(prev => ({
                        ...prev,
                        [weekTitle]: e.target.value
                      }))
                    }
                    placeholder="Add a short week note (important message)..."
                    className="w-full border rounded-md p-3 text-sm bg-white"
                    rows={3}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveWeekNote(weekTitle)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                      disabled={savingWeek === weekTitle}
                    >
                      <FontAwesomeIcon icon={faSave} />
                      {savingWeek === weekTitle ? "Saving..." : "Save Note"}
                    </button>

                    <button
                      onClick={() =>
                        setNoteDrafts(prev => ({
                          ...prev,
                          [weekTitle]: getSavedNote(weekTitle)
                        }))
                      }
                      className="px-4 py-2 rounded-md border bg-white text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* MATERIALS LIST */}
                {(materialsByWeek[weekTitle] || []).map(m => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center border rounded-md p-3"
                  >
                    <div className="text-sm">{m.title}</div>

                    <button
                      className="text-red-600"
                      onClick={() =>
                        askDelete("Delete material?", async () => {
                          await apiFetch(`/api/teacher/materials/${m.id}`, {
                            method: "DELETE"
                          });
                          await refreshMaterials();
                          setConfirmOpen(false);
                        })
                      }
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </>
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Confirm"
        message={confirmText}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => confirmAction && confirmAction()}
      />
    </div>
  );
}
