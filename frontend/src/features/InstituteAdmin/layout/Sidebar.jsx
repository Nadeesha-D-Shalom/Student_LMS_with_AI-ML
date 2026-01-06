import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faUserGraduate,
  faChalkboardTeacher,
  faUserShield,
  faCalendarCheck,
  faMoneyBill,
  faComments,
  faBell,
  faBullhorn,
  faFileLines,
  faGear,
  faHeadset
  
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../components/Badge";

const LINKS = [
  { name: "Dashboard", path: "/instituteadmin/dashboard", icon: faGaugeHigh },
  { name: "Students", path: "/instituteadmin/students", icon: faUserGraduate },
  { name: "Teachers", path: "/instituteadmin/teachers", icon: faChalkboardTeacher },
  { name: "Admins", path: "/instituteadmin/admins", icon: faUserShield },
  { name: "Attendance", path: "/instituteadmin/attendance", icon: faCalendarCheck },
  { name: "Payments", path: "/instituteadmin/payments", icon: faMoneyBill, badge: 3 },
  { name: "Messages", path: "/instituteadmin/messages", icon: faComments, badge: 2 },
  { name: "Notices", path: "/instituteadmin/notices", icon: faBell, badge: 1 },
  { name: "Advertisements", path: "/instituteadmin/advertisements", icon: faBullhorn },
  { name: "Reports", path: "/instituteadmin/reports", icon: faFileLines },
  { name: "Settings", path: "/instituteadmin/settings", icon: faGear },
  { name: "Help", path: "/instituteadmin/help", icon: faHeadset }

];

const Sidebar = ({ open }) => {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="h-16 flex items-center px-6 font-semibold text-blue-600">
        Institute Admin
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-lg border bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Signed in</p>
          <p className="text-sm font-medium text-gray-900">ADM001</p>
          <p className="text-xs text-gray-600">Institute Admin</p>
        </div>
      </div>

      <nav className="px-3 space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.name}
            to={l.path}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium
              ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <FontAwesomeIcon icon={l.icon} className="w-4" />
              {l.name}
            </span>
            {l.badge ? <Badge variant="info">{l.badge}</Badge> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
