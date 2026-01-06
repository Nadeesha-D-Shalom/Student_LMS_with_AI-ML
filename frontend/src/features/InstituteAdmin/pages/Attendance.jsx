import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import { storage } from "../services/storage";

const CURRENT_ADMIN = { adminId: "ADM001", name: "Admin A" };

const TEACHERS = ["Mr. Perera", "Ms. Silva", "Mr. Fernando"];
const SUBJECTS = ["Mathematics", "Science", "ICT"];
const GRADES = ["Grade 10", "Grade 11"];

// UI-only class roster
const CLASS_STUDENTS = [
  { id: "ST001", name: "Nimal Perera", nic: "200312345678", phone: "07X XXX XXXX" },
  { id: "ST002", name: "Kavindu Silva", nic: "200398765432", phone: "07X XXX XXXX" },
  { id: "ST003", name: "Sahan Jayasuriya", nic: "200376543210", phone: "07X XXX XXXX" },
  { id: "ST004", name: "Dinuka Fernando", nic: "200323456789", phone: "07X XXX XXXX" }
];

const Attendance = () => {
  const [session, setSession] = useState({
    teacher: "",
    subject: "",
    grade: "",
    date: "",
    time: ""
  });

  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  // records are created after load
  const [records, setRecords] = useState([]);

  const canLoad =
    session.teacher && session.subject && session.grade && session.date && session.time;

  const loadClass = () => {
    // initialize per student: present + payment flags
    const init = CLASS_STUDENTS.map((s) => ({
      ...s,
      present: true,
      paymentDone: false,
      paymentDateTime: "" // filled when paymentDone is checked
    }));
    setRecords(init);
    setLoaded(true);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((s) => {
      return (
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.nic.toLowerCase().includes(q)
      );
    });
  }, [search, records]);

  const togglePresent = (studentId) => {
    setRecords((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, present: !s.present } : s))
    );
  };

  const togglePayment = (studentId) => {
    const now = new Date();
    const dt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setRecords((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const nextDone = !s.paymentDone;
        return {
          ...s,
          paymentDone: nextDone,
          paymentDateTime: nextDone ? dt : ""
        };
      })
    );
  };

  const submitAttendance = () => {
    const classLabel = `${session.grade} - ${session.subject}`;
    const report = {
      id: `REP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      classLabel,
      teacher: session.teacher,
      subject: session.subject,
      grade: session.grade,
      date: session.date,
      time: session.time,
      adminId: CURRENT_ADMIN.adminId,
      adminName: CURRENT_ADMIN.name,
      rows: records.map((r) => ({
        studentId: r.id,
        name: r.name,
        nic: r.nic,
        phone: r.phone,
        present: r.present ? "Present" : "Absent",
        paymentDone: r.paymentDone ? "Paid" : "Unpaid",
        paymentDateTime: r.paymentDateTime || "-"
      }))
    };

    const current = storage.getReports();
    const next = [report, ...current];
    storage.saveReports(next);

    alert("Attendance submitted. Report added to Reports (UI only).");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Attendance"
        subtitle="Select class session, load student list, mark attendance and payment, then submit."
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Session Setup</h2>
        <p className="mt-1 text-sm text-gray-600">Choose teacher, subject, grade, date and time.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
          <select
            value={session.teacher}
            onChange={(e) => setSession((p) => ({ ...p, teacher: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Choose Teacher Name</option>
            {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={session.subject}
            onChange={(e) => setSession((p) => ({ ...p, subject: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={session.grade}
            onChange={(e) => setSession((p) => ({ ...p, grade: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="">Grade</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          <input
            type="date"
            value={session.date}
            onChange={(e) => setSession((p) => ({ ...p, date: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="time"
            value={session.time}
            onChange={(e) => setSession((p) => ({ ...p, time: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" disabled={!canLoad} onClick={loadClass}>
            Load Class Students
          </Button>
          <div className="text-sm text-gray-600 flex items-center">
            Admin: <span className="ml-2 font-medium text-gray-900">{CURRENT_ADMIN.adminId}</span>
          </div>
        </div>
      </div>

      {loaded ? (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Mark Attendance</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Search by name, Student ID, or NIC. Mark attendance and payment for today.
                </p>
              </div>

              <div className="w-full sm:max-w-sm">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name / ID / NIC"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <DataTable
                keyField="id"
                columns={[
                  { key: "id", label: "Student ID" },
                  { key: "name", label: "Name" },
                  { key: "nic", label: "NIC" },
                  {
                    key: "present",
                    label: "Attendance",
                    render: (r) => (
                      <div className="flex items-center gap-2">
                        <Badge variant={r.present ? "success" : "danger"}>
                          {r.present ? "Present" : "Absent"}
                        </Badge>
                        <input
                          type="checkbox"
                          checked={r.present}
                          onChange={() => togglePresent(r.id)}
                        />
                      </div>
                    )
                  },
                  {
                    key: "payment",
                    label: "Payment Today",
                    render: (r) => (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={r.paymentDone ? "success" : "neutral"}>
                            {r.paymentDone ? "Paid" : "Unpaid"}
                          </Badge>
                          <input
                            type="checkbox"
                            checked={r.paymentDone}
                            onChange={() => togglePayment(r.id)}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.paymentDone ? `Paid at: ${r.paymentDateTime}` : "—"}
                        </div>
                      </div>
                    )
                  }
                ]}
                rows={filtered}
                emptyTitle="No students match your search"
                emptyDescription="Try searching by Student ID or NIC."
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button variant="primary" onClick={submitAttendance}>
                Submit Attendance & Generate Report
              </Button>

              <div className="text-sm text-gray-600">
                Session:{" "}
                <span className="font-medium text-gray-900">
                  {session.grade} - {session.subject} • {session.teacher} • {session.date} {session.time}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Attendance;
