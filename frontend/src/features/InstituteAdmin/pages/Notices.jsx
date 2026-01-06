import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Button from "../components/Button";

const NOTICES_DATA = [
  {
    id: 1,
    title: "Term Test Schedule",
    audience: "Students",
    date: "2026-01-06",
    status: "Published"
  },
  {
    id: 2,
    title: "Teacher Meeting",
    audience: "Teachers",
    date: "2026-01-05",
    status: "Draft"
  }
];

const Notices = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [audience, setAudience] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return NOTICES_DATA.filter((n) => {
      const matchText =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.date.toLowerCase().includes(q);

      const matchAudience =
        audience === "All" ? true : n.audience === audience;

      return matchText && matchAudience;
    });
  }, [search, audience]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notices"
        subtitle="Create and manage notices (UI only)."
        right={
          <Button
            variant="primary"
            onClick={() =>
              navigate("/instituteadmin/notices/new")
            }
          >
            Add Notice
          </Button>
        }
      />

      <Toolbar
        search={search}
        setSearch={setSearch}
        filters={
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Students</option>
            <option>Teachers</option>
          </select>
        }
      />

      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "audience", label: "Audience" },
          { key: "date", label: "Date" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge
                variant={r.status === "Published" ? "success" : "neutral"}
              >
                {r.status}
              </Badge>
            )
          }
        ]}
        rows={filtered}
        emptyTitle="No notices found"
        emptyDescription="Click 'Add Notice' to publish one."
      />
    </div>
  );
};

export default Notices;
