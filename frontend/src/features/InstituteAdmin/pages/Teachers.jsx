import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Button from "../components/Button";

const TEACHERS_DATA = [
  { id: 1, name: "Mr. Perera", subject: "Mathematics", phone: "07X XXX XXXX", status: "Active" },
  { id: 2, name: "Ms. Silva", subject: "Science", phone: "07X XXX XXXX", status: "Active" },
  { id: 3, name: "Mr. Fernando", subject: "ICT", phone: "07X XXX XXXX", status: "Inactive" }
];

const Teachers = () => {
  const navigate = useNavigate(); // FIX
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEACHERS_DATA.filter((t) => {
      const matchText =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q);

      const matchSubject = subject === "All" ? true : t.subject === subject;
      return matchText && matchSubject;
    });
  }, [search, subject]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Teachers"
        subtitle="Manage teaching staff and subjects."
        right={
          <Button
            variant="primary"
            onClick={() => navigate("/instituteadmin/teachers/new")}
          >
            Add Teacher
          </Button>
        }
      />

      <Toolbar
        search={search}
        setSearch={setSearch}
        filters={
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>ICT</option>
          </select>
        }
      />

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "subject", label: "Subject" },
          { key: "phone", label: "Phone" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "Active" ? "success" : "neutral"}>
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

export default Teachers;
