import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../api/api";

const iconLabel = (t) => {
  const v = (t || "").toUpperCase();
  if (v === "PDF") return "PDF";
  if (v === "SLIDE") return "Slides";
  if (v === "DOC") return "Doc";
  return "File";
};

const Materials = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("ALL"); // ALL | PDF | SLIDE | DOC
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/student/materials");
      const list = Array.isArray(res) ? res : res?.items || [];
      setItems(list);
    } catch (e) {
      setError("Failed to load study materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((m) => {
        const mt = (m.material_type || m.type || "").toUpperCase();
        if (type === "ALL") return true;
        return mt === type;
      })
      .filter((m) => {
        if (!query) return true;
        const hay = [
          m.title || "",
          m.class_name || "",
          m.material_type || m.type || ""
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
  }, [items, type, q]);

  if (loading) {
    return <div className="p-6">Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Study Materials
          </h1>
          <p className="text-sm text-slate-600">
            All notes and lesson files uploaded by your teachers.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto">
            {["ALL", "PDF", "SLIDE", "DOC"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-semibold transition",
                  type === t
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                ].join(" ")}
              >
                {t === "ALL" ? "All" : t}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-[360px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or class..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="font-semibold">Unable to load</div>
          <div className="mt-1">{error}</div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-base font-semibold text-slate-900">
            No materials found
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Teachers have not uploaded content yet, or your filters are too strict.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <a
              key={m.id}
              href={m.file_url || m.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {m.title || "Untitled material"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {m.class_name || "Class"} ·{" "}
                    <span className="font-semibold text-slate-700">
                      {iconLabel(m.material_type || m.type)}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  Open
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Materials;
