import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Button from "../components/Button";

const STUDENTS_DATA = [
  { id: 1, name: "Nimal Perera", grade: "Grade 11", phone: "07X XXX XXXX", status: "Pending" },
  { id: 2, name: "Kavindu Silva", grade: "Grade 10", phone: "07X XXX XXXX", status: "Approved" },
  { id: 3, name: "Dinuka Fernando", grade: "Grade 11", phone: "07X XXX XXXX", status: "Approved" },
  { id: 4, name: "Sahan Jayasuriya", grade: "Grade 10", phone: "07X XXX XXXX", status: "Pending" }
];

const Students = () => {
  const navigate = useNavigate(); // FIX
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STUDENTS_DATA.filter((s) => {
      const matchText =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.grade.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q);

      const matchStatus = status === "All" ? true : s.status === status;
      return matchText && matchStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Students"
        subtitle="Manage student registrations and basic records."
        right={
          <Button
            variant="primary"
            onClick={() => navigate("/instituteadmin/students/new")}
          >
            Add Student
          </Button>
        }
      />

      <Toolbar
        search={search}
        setSearch={setSearch}
        filters={
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
        }
      />

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "grade", label: "Grade" },
          { key: "phone", label: "Phone" },
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
        rows={filtered}
      />
    </div>
  );
};

export default Students;
