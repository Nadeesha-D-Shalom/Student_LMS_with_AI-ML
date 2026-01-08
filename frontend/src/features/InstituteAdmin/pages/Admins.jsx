import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { storage } from "../services/storage";

const MODULES = [
  "Dashboard",
  "Students",
  "Teachers",
  "Admins",
  "Attendance",
  "Payments",
  "Messages",
  "Notices",
  "Advertisements",
  "Reports",
  "Settings"
];

const DEFAULT_ADMINS = [
  {
    id: "ADM001",
    name: "Admin A",
    role: "Institute Admin",
    permissions: MODULES
  },
  {
    id: "ADM002",
    name: "Admin B",
    role: "Finance Admin",
    permissions: ["Dashboard", "Payments", "Reports"]
  }
];

const Admins = () => {
  const navigate = useNavigate(); // FIX
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState(DEFAULT_ADMINS);

  useEffect(() => {
    const saved = storage.getAdmins();
    if (saved && Array.isArray(saved)) setAdmins(saved);
    else storage.saveAdmins(DEFAULT_ADMINS);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return admins.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    );
  }, [search, admins]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admins"
        subtitle="Manage admin users and module-level permissions."
        right={
          <Button
            variant="primary"
            onClick={() => navigate("/instituteadmin/admins/new")}
          >
            Add Admin
          </Button>
        }
      />

      <Toolbar search={search} setSearch={setSearch} />

      <DataTable
        columns={[
          { key: "id", label: "Admin ID" },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          {
            key: "permissions",
            label: "Permissions",
            render: (r) => (
              <Badge variant="info">{r.permissions.length} modules</Badge>
            )
          }
        ]}
        rows={filtered}
      />
    </div>
  );
};

export default Admins;
