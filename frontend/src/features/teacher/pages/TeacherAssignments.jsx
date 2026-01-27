import React, { useEffect, useState, useRef } from "react";
import { apiFetch } from "../../../api/api";

/* ================= CLASS DROPDOWN ================= */
function ClassSelectDropdown({ classes, selectedClasses, toggleClass }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center border rounded-lg px-4 py-3 text-sm bg-white"
      >
        <span>
          {selectedClasses.length === 0
            ? "Select Classes"
            : `${selectedClasses.length} class(es) selected`}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow max-h-64 overflow-auto">
          {classes.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No classes available
            </div>
          ) : (
            classes.map((cls) => (
              <label
                key={cls.id}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(cls.id)}
                  onChange={() => toggleClass(cls.id)}
                  className="accent-blue-600"
                />
                {cls.class_name ||
                  cls.name ||
                  cls.subject_name ||
                  (cls.subject && cls.grade
                    ? `Grade ${cls.grade} ${cls.subject}`
                    : `Class ${cls.id}`)}

              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function TeacherAssignments() {
  const academicYear = "2026";

  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
    total_marks: 100,
    allow_late: false
  });

  const [editForm, setEditForm] = useState({});

  /* ================= LOAD ================= */
  const loadAll = async () => {
    setLoading(true);
    try {
      const [cls, asg] = await Promise.all([
        apiFetch("/api/teacher/classes"),
        apiFetch("/api/teacher/assignments")
      ]);
      setClasses(cls.items || []);
      setAssignments(asg.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= HELPERS ================= */
  const toggleClass = (id) => {
    setSelectedClasses((p) =>
      p.includes(id) ? p.filter((c) => c !== id) : [...p, id]
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= CREATE ================= */
  const createAssignment = async () => {
    if (!form.title || !form.due_date || !form.due_time || selectedClasses.length === 0) {
      return;
    }

    for (const classId of selectedClasses) {
      await apiFetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id: classId, ...form })
      });
    }

    setForm({
      title: "",
      description: "",
      due_date: "",
      due_time: "",
      total_marks: 100,
      allow_late: false
    });
    setSelectedClasses([]);
    loadAll();
  };

  /* ================= EDIT ================= */
  const startEdit = (a) => {
    setEditingId(a.id);
    setEditForm({
      title: a.title,
      description: a.description,
      due_date: a.due_date,
      due_time: a.due_time
    });
  };

  const saveEdit = async (id) => {
    await apiFetch(`/api/teacher/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    });
    setEditingId(null);
    loadAll();
  };

  /* ================= VISIBILITY ================= */
  const toggleVisibility = async (id, active) => {
    await apiFetch(`/api/teacher/assignments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !active })
    });
    loadAll();
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <p className="text-sm text-gray-500">
          Academic Year {academicYear} • Create, edit, hide or enable assignments
        </p>
      </div>

      {/* CLASS SELECT */}
      <div className="bg-white border rounded-xl p-5">
        <h2 className="font-medium mb-3">Select Classes</h2>
        <ClassSelectDropdown
          classes={classes}
          selectedClasses={selectedClasses}
          toggleClass={toggleClass}
        />
      </div>

      {/* CREATE */}
      <div className="bg-white border rounded-xl p-5 space-y-4">
        <h2 className="font-medium">Create Assignment</h2>

        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Assignment title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="border rounded-lg px-3 py-2" />
          <input type="time" name="due_time" value={form.due_time} onChange={handleChange} className="border rounded-lg px-3 py-2" />
        </div>

        <button
          onClick={createAssignment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create Assignment
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        <h2 className="font-medium">Published Assignments</h2>

        {assignments.map((a) => (
          <div key={a.id} className="bg-white border rounded-xl p-5 space-y-3">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-500">
                  {a.class_name} • Due {a.due_date} {a.due_time}
                </p>
              </div>

              <button
                onClick={() => toggleVisibility(a.id, a.is_active)}
                className="text-xs text-gray-600 hover:text-blue-600"
              >
                {a.is_active ? "👁 Visible" : "🚫 Hidden"}
              </button>
            </div>

            {editingId === a.id ? (
              <div className="space-y-3">
                <input className="w-full border rounded-lg px-3 py-2" name="title" value={editForm.title} onChange={handleEditChange} />
                <textarea className="w-full border rounded-lg px-3 py-2" name="description" value={editForm.description} onChange={handleEditChange} />
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(a.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Save</button>
                  <button onClick={() => setEditingId(null)} className="border px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => startEdit(a)} className="text-sm text-blue-600 hover:underline">
                Edit assignment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
