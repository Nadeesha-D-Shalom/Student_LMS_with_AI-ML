import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import SectionHeader from "../components/SectionHeader";
import Badge from "../components/Badge";
import { storage } from "../services/storage";

const RECENT_STUDENTS = [
  { id: 1, name: "Nimal Perera", grade: "Grade 11", status: "Pending" },
  { id: 2, name: "Kavindu Silva", grade: "Grade 10", status: "Approved" },
  { id: 3, name: "Sahan Jayasuriya", grade: "Grade 11", status: "Pending" }
];

const Dashboard = () => {
  const reports = storage.getReports();
  const latest = reports[0];

  const stats = [
    { title: "Students", value: "1,245", subtitle: "Total enrolled" },
    { title: "Teachers", value: "48", subtitle: "Active instructors" },
    { title: "Attendance Reports", value: String(reports.length), subtitle: "Generated reports" },
    { title: "Last Attendance", value: latest ? `${latest.date} ${latest.time}` : "—", subtitle: latest ? latest.classLabel : "No reports yet" }
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Institute Dashboard" subtitle="Operational overview and quick actions." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">Recent Student Registrations</h2>
        <p className="mt-1 text-sm text-gray-600">New registrations awaiting verification.</p>

        <div className="mt-4">
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "grade", label: "Grade" },
              {
                key: "status",
                label: "Status",
                render: (r) => (
                  <Badge variant={r.status === "Pending" ? "warning" : "success"}>
                    {r.status}
                  </Badge>
                )
              }
            ]}
            rows={RECENT_STUDENTS}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
