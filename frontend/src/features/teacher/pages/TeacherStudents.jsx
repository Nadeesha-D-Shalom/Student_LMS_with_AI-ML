import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";

export default function TeacherStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchBy, setSearchBy] = useState("name");
  const [query, setQuery] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);

    let url = "/api/teacher/students";

    if (query.trim()) {
      url += `?search_by=${searchBy}&query=${encodeURIComponent(query)}`;
    }

    try {
      const res = await apiFetch(url);
      setStudents(res.items || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [searchBy, query]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const onSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Students</h2>

      {/* SEARCH */}
      <form
        onSubmit={onSearch}
        className="flex gap-3 items-center bg-white border rounded-lg p-4"
      >
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="name">Name</option>
          <option value="user_id">Student ID</option>
          <option value="mobile">Mobile Number</option>
          <option value="grade">Grade</option>
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search value..."
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Search
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Student ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Parent Mobile</th>
              <th className="px-4 py-3 text-left">Grade</th>
              <th className="px-4 py-3 text-left">Age</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.user_id}
                  onClick={() =>
                    navigate(`/teacher/students/${s.user_id}`)
                  }
                  className="border-t hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3">{s.user_id}</td>
                  <td className="px-4 py-3 font-medium">
                    {s.first_name} {s.last_name}
                  </td>
                  <td className="px-4 py-3">{s.personal_mobile}</td>
                  <td className="px-4 py-3">{s.parent_mobile}</td>
                  <td className="px-4 py-3">{s.grade}</td>
                  <td className="px-4 py-3">{s.age}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
