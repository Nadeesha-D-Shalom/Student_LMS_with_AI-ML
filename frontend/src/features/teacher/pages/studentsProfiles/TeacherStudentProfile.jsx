import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../../../api/api";

export default function TeacherStudentProfile() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/teacher/students/${studentId}`)
      .then(res => setStudent(res))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return <div className="p-6 text-sm">Loading profile...</div>;
  }

  if (!student) {
    return <div className="p-6 text-sm">Student not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">
          {student.first_name} {student.last_name}
        </h1>
        <p className="text-sm text-gray-500">
          Student Profile Overview
        </p>
      </div>

      {/* BASIC INFO */}
      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          BASIC INFORMATION
        </h2>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
          <ProfileItem label="Student ID" value={student.user_id} />
          <ProfileItem label="Grade" value={student.grade} />
          <ProfileItem label="Age" value={student.age} />
          <ProfileItem label="Institute" value={student.institute_location} />
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          CONTACT INFORMATION
        </h2>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
          <ProfileItem
            label="Student Mobile"
            value={student.personal_mobile}
          />
          <ProfileItem
            label="Parent Mobile"
            value={student.parent_mobile}
          />
        </div>
      </section>

      {/* STATUS */}
      <section className="bg-white border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          STATUS
        </h2>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Free Card</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              student.free_card
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {student.free_card ? "Approved" : "Not Approved"}
          </span>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------
   Reusable profile row
------------------------------------ */
function ProfileItem({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">
        {label}
      </div>
      <div className="font-medium text-gray-900">
        {value || "-"}
      </div>
    </div>
  );
}
