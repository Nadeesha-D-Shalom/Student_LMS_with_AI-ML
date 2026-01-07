import React from "react";

const SystemStatusBadge = ({ status = "ONLINE" }) => {
  const isOnline = String(status).toUpperCase() === "ONLINE";

  const cls = isOnline
    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
    : "bg-rose-50 text-rose-700 border-rose-100";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {isOnline ? "Online" : "Locked"}
    </span>
  );
};

export default SystemStatusBadge;
