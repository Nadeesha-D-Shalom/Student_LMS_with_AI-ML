import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex flex-col flex-1">
        <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
