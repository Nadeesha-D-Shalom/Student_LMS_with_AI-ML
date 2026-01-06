import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faUserShield,
  faUsers,
  faChalkboardTeacher,
  faCalendarCheck,
  faMoneyBill,
  faBullhorn,
  faComments,
  faFileLines,
  faGear,
  faCircleInfo
} from "@fortawesome/free-solid-svg-icons";
import { APP_VERSION } from "../../../config/appConfig";

const SECTIONS = [
  {
    title: "Admin Roles & Permissions",
    icon: faUserShield,
    content: [
      "Institute Admin: Has full system access including Students, Teachers, Attendance, Payments, Reports, Settings, and Admin management.",
      "Finance Admin: Limited to Payments and Reports modules only. Cannot modify academic or system settings.",
      "Admins are created from the Admins section using a unique Admin ID.",
      "Module-level permissions can be enabled or disabled per admin.",
      "Best practice: Grant only the minimum permissions required for each admin role."
    ]
  },
  {
    title: "Student Management",
    icon: faUsers,
    content: [
      "Navigate to Students → Add Student to register a new student.",
      "Required details typically include Student Name, Student ID, Grade, Phone Number, and Guardian details.",
      "Student ID must be unique and should be used consistently across Attendance and Payments.",
      "Use the search bar to find students by name, grade, or phone number.",
      "Student status (Pending / Approved) should be reviewed before allowing attendance marking."
    ]
  },
  {
    title: "Teacher Management",
    icon: faChalkboardTeacher,
    content: [
      "Navigate to Teachers → Add Teacher to register a new teacher.",
      "Each teacher should have a unique Teacher ID and at least one assigned subject.",
      "Teacher subject selection directly affects Attendance and class filtering.",
      "Inactive teachers will not appear in Attendance selection lists.",
      "Ensure teacher contact details are correct for communication purposes."
    ]
  },
  {
    title: "Attendance Management",
    icon: faCalendarCheck,
    content: [
      "Navigate to Attendance to start a new class attendance session.",
      "Select Teacher, Subject, Grade, Date, and Time before loading students.",
      "Once loaded, all students belonging to that class will be displayed.",
      "Admins can search students by Name, Student ID, or NIC.",
      "Mark each student as Present or Absent.",
      "If a student makes payment during the class, mark Payment Done with the same date and time.",
      "After verifying all entries, click Submit Attendance.",
      "Submitting attendance automatically generates a report entry."
    ]
  },
  {
    title: "Payments",
    icon: faMoneyBill,
    content: [
      "Payments can be tracked directly from the Payments module or during Attendance marking.",
      "When payment is recorded during attendance, it is linked to the class date and time.",
      "Payment status is stored per student and reflected in Reports.",
      "Use consistent payment dates to avoid reporting mismatches.",
      "Finance Admins should review payment records regularly."
    ]
  },
  {
    title: "Messages & Communication",
    icon: faComments,
    content: [
      "Students can send messages to admins through the Messages module.",
      "Admins can view unread messages from the Messages section.",
      "Click a conversation to read the student message.",
      "Admins can reply directly; replies are logged in the conversation thread (UI only).",
      "Unread message counts appear in the sidebar for quick visibility."
    ]
  },
  {
    title: "Notices & Advertisements",
    icon: faBullhorn,
    content: [
      "Use Notices to publish announcements such as exams, events, or urgent messages.",
      "Each notice can be targeted to Students, Teachers, or All users.",
      "Advertisements are used for promotional banners on Dashboard or Classes pages.",
      "Advertisements can be activated or deactivated without deleting them.",
      "Avoid excessive active advertisements to maintain clean UI."
    ]
  },
  {
    title: "Reports",
    icon: faFileLines,
    content: [
      "Reports are automatically generated after Attendance submission.",
      "Each report includes Teacher, Subject, Grade, Date, Time, Admin ID, and Payment status.",
      "Reports provide a historical record of class sessions.",
      "Admins can download reports in CSV or PDF format (UI-ready).",
      "Reports should be reviewed periodically for accuracy."
    ]
  },
  {
    title: "System Settings",
    icon: faGear,
    content: [
      "System Settings are accessible only to Institute Admins.",
      "Settings control system-level configurations and future enhancements.",
      "Any critical system change should be done cautiously.",
      "It is recommended to maintain a change log for administrative actions.",
      "Future updates may include themes, access logs, and audit tracking."
    ]
  }
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl space-y-6 pb-16">

      <SectionHeader
        title="Admin Help & Guidelines"
        subtitle="Complete operational guide for institute administrators."
      />

      {/* SYSTEM INFO */}
      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <FontAwesomeIcon icon={faCircleInfo} className="mt-1 text-blue-600" />
        <div className="text-sm text-blue-900">
          <p><strong>Application Version:</strong> {APP_VERSION}</p>
        </div>
      </div>

      {/* GUIDELINES */}
      <div className="space-y-3">
        {SECTIONS.map((section, index) => {
          const open = openIndex === index;

          return (
            <div
              key={section.title}
              className="rounded-xl border border-gray-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                  <FontAwesomeIcon icon={section.icon} />
                  {section.title}
                </span>

                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className="text-gray-500"
                />
              </button>

              {open && (
                <div className="space-y-2 px-5 pb-4 text-sm text-gray-700">
                  {section.content.map((item, i) => (
                    <p key={i}>• {item}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="pt-10 text-center text-xs text-gray-500 border-t">
        Version {APP_VERSION} · Made with ❤️ · Developed by{" "}
        <strong className="text-gray-700">Nadeesha D Shalom</strong>
      </div>

    </div>
  );
};

export default Help;
