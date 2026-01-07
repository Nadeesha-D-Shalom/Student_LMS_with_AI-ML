import React, { useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faLock,
  faArrowsRotate,
  faUsers,
  faUserShield,
  faFileLines,
  faBell,
  faEnvelope,
  faDatabase,
  faUserCircle,
  faRightFromBracket,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { APP_VERSION } from "../../../config/appConfig";

const navItems = [
  { to: "/it-admin", label: "Dashboard", icon: faGaugeHigh, exact: true },
  { to: "/it-admin/system-lock", label: "System Lock", icon: faLock },
  { to: "/it-admin/system-updates", label: "System Updates", icon: faArrowsRotate },
  { to: "/it-admin/user-stats", label: "User Stats", icon: faUsers },
  { to: "/it-admin/admin-management", label: "Admin Management", icon: faUserShield },
  { to: "/it-admin/audit-logs", label: "Audit Logs", icon: faFileLines },
  { to: "/it-admin/notifications", label: "Notifications", icon: faBell },
  { to: "/it-admin/messages", label: "Messages", icon: faEnvelope },
  { to: "/it-admin/backups", label: "Backups", icon: faDatabase },
  { to: "/it-admin/profile", label: "My Profile", icon: faUserCircle }
];

const getTitle = (pathname) => {
  if (pathname === "/it-admin") return "IT Admin Dashboard";
  if (pathname.includes("/system-lock")) return "System Lock";
  if (pathname.includes("/system-updates")) return "System Updates";
  if (pathname.includes("/user-stats")) return "User Statistics";
  if (pathname.includes("/admin-management")) return "Admin Management";
  if (pathname.includes("/audit-logs")) return "Audit Logs";
  if (pathname.includes("/notifications")) return "Notifications";
  if (pathname.includes("/messages")) return "Messages";
  if (pathname.includes("/backups")) return "Backups";
  if (pathname.includes("/profile")) return "My Profile";
  return "IT Admin";
};

const ITAdminLayout = () => {
  const location = useLocation();
  const title = useMemo(() => getTitle(location.pathname), [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white">
          {/* Brand */}
          <div className="h-16 px-6 flex items-center border-b border-slate-200">
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                Student LMS
              </span>
              <span className="text-xs text-slate-500">
                IT Admin Console
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active =
                location.pathname === item.to ||
                (!item.exact && location.pathname.startsWith(item.to));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={[
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  ].join(" ")}
                >
                  {/* Active indicator */}
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r",
                      active ? "bg-slate-900" : "bg-transparent"
                    ].join(" ")}
                  />

                  <FontAwesomeIcon
                    icon={item.icon}
                    className={[
                      "text-sm",
                      active ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    ].join(" ")}
                  />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Environment */}
          <div className="p-4 border-t border-slate-200">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600" />
                Production Ready
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Version {APP_VERSION}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN AREA ================= */}
        <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
          {/* ================= TOPBAR ================= */}
          <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  System-level controls and monitoring
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  System Online
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-700 transition"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          {/* ================= CONTENT ================= */}
          <main className="flex-1 px-4 sm:px-6 py-6">
            <Outlet />
          </main>

          {/* ================= FOOTER ================= */}
          <footer className="px-4 sm:px-6 py-4 text-xs text-slate-500 border-t border-slate-200 bg-white">
            IT Admin Console • Made with ❤️ · Developed by{" "}
            <strong className="text-gray-700">Nadeesha D Shalom</strong>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ITAdminLayout;
