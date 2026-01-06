import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";
import Button from "../components/Button";

const ADS_DATA = [
  { id: 1, title: "New Year Offer", placement: "Dashboard", status: "Active" },
  { id: 2, title: "Free Seminar", placement: "Classes", status: "Inactive" }
];

const Advertisements = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADS_DATA.filter((a) => {
      const matchText =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.placement.toLowerCase().includes(q);

      const matchState = state === "All" ? true : a.status === state;
      return matchText && matchState;
    });
  }, [search, state]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Advertisements"
        subtitle="Manage banners and placements (UI only)."
        right={
          <Button
            variant="primary"
            onClick={() =>
              navigate("/instituteadmin/advertisements/new")
            }
          >
            Add Advertisement
          </Button>
        }
      />

      <Toolbar
        search={search}
        setSearch={setSearch}
        filters={
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        }
      />

      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "placement", label: "Placement" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge
                variant={r.status === "Active" ? "success" : "neutral"}
              >
                {r.status}
              </Badge>
            )
          }
        ]}
        rows={filtered}
        emptyTitle="No advertisements found"
        emptyDescription="Click 'Add Advertisement' to create one."
      />
    </div>
  );
};

export default Advertisements;
