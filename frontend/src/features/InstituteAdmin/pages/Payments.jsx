import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Toolbar from "../components/Toolbar";
import DataTable from "../components/DataTable";
import Badge from "../components/Badge";

const PAYMENTS_DATA = [
  { id: 1, student: "Nimal Perera", month: "January", amount: "LKR 3,500", status: "Paid" },
  { id: 2, student: "Kavindu Silva", month: "January", amount: "LKR 3,500", status: "Unpaid" },
  { id: 3, student: "Dinuka Fernando", month: "December", amount: "LKR 3,500", status: "Paid" }
];

const Payments = () => {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYMENTS_DATA.filter((p) => {
      const matchText = !q || p.student.toLowerCase().includes(q) || p.month.toLowerCase().includes(q);
      const matchState = state === "All" ? true : p.status === state;
      return matchText && matchState;
    });
  }, [search, state]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Payments" subtitle="Track monthly payments (UI only)." />

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
            <option>Paid</option>
            <option>Unpaid</option>
          </select>
        }
      />

      <DataTable
        columns={[
          { key: "student", label: "Student" },
          { key: "month", label: "Month" },
          { key: "amount", label: "Amount" },
          {
            key: "status",
            label: "Status",
            render: (r) => (
              <Badge variant={r.status === "Paid" ? "success" : "danger"}>
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

export default Payments;
