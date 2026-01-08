import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Home from "./pages/Home/Home";
import Login from "./features/Auth/Login";
import Signup from "./features/Auth/Signup";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= STUDENT ================= */
import StudentLayout from "./features/student/layout/StudentLayout";
import Dashboard from "./features/student/dashboard/Dashboard";

/* ================= STUDENT LEARNING ================= */
import Classes from "./features/student/classes/Classes";
import ClassGradeSelect from "./features/student/classes/ClassGradeSelect";
import ClassWorkspace from "./features/student/classes/ClassWorkspace";
import LiveClasses from "./features/student/classes/LiveClasses";
import ClassRecordings from "./features/student/classes/ClassRecordings";
import AssignmentSubmission from "./features/student/classes/AssignmentSubmission";
import AssignmentDetail from "./features/student/assessments/AssignmentDetail";


/* ================= STUDENT ASSESSMENTS ================= */
import Assignments from "./features/student/assessments/Assignments";
import Tests from "./features/student/assessments/Tests";
import Results from "./features/student/assessments/Results";

/* ================= STUDENT COMMUNICATION ================= */
import Messages from "./features/student/communication/Messages";
import Questions from "./features/student/communication/Questions";
import Announcements from "./features/student/communication/Announcements";

/* ================= STUDENT PRODUCTIVITY ================= */
import Calendar from "./features/student/productivity/Calendar";
import Todo from "./features/student/productivity/Todo";
import Progress from "./features/student/productivity/Progress";

/* ================= STUDENT ACCOUNT ================= */
import Profile from "./features/student/profile/Profile";
import Settings from "./features/student/profile/Settings";
import Help from "./features/student/profile/Help";

/* ================= AI ================= */
import AIAssistant from "./features/student/assistant/AIAssistant";

/* ================= TEACHER (LAZY) ================= */
const TeacherLayout = lazy(() =>
  import("./features/teacher/layout/TeacherLayout")
);
const TeacherDashboard = lazy(() =>
  import("./features/teacher/pages/TeacherDashboard")
);
const TeacherMyClasses = lazy(() =>
  import("./features/teacher/pages/TeacherMyClasses")
);
const TeacherStudents = lazy(() =>
  import("./features/teacher/pages/TeacherStudents")
);
const TeacherContent = lazy(() =>
  import("./features/teacher/pages/TeacherContent")
);
const TeacherAssignments = lazy(() =>
  import("./features/teacher/pages/TeacherAssignments")
);
const TeacherTests = lazy(() =>
  import("./features/teacher/pages/TeacherTests")
);
const TeacherGradeWorkspace = lazy(() =>
  import("./features/teacher/grades/TeacherGradeWorkspace")
);
const TeacherHelp = lazy(() =>
  import("./features/teacher/pages/TeacherHelp")
);

/* ================= INSTITUTE ADMIN (LAZY) ================= */
const InstituteAdminLayout = lazy(() =>
  import("./features/InstituteAdmin/layout/AdminLayout")
);
const AdminDashboard = lazy(() =>
  import("./features/InstituteAdmin/pages/Dashboard")
);
const AdminStudents = lazy(() =>
  import("./features/InstituteAdmin/pages/Students")
);
const AdminTeachers = lazy(() =>
  import("./features/InstituteAdmin/pages/Teachers")
);
const AdminAdmins = lazy(() =>
  import("./features/InstituteAdmin/pages/Admins")
);
const AdminAttendance = lazy(() =>
  import("./features/InstituteAdmin/pages/Attendance")
);
const AdminMessages = lazy(() =>
  import("./features/InstituteAdmin/pages/Messages")
);
const AdminPayments = lazy(() =>
  import("./features/InstituteAdmin/pages/Payments")
);
const AdminNotices = lazy(() =>
  import("./features/InstituteAdmin/pages/Notices")
);
const AdminAdvertisements = lazy(() =>
  import("./features/InstituteAdmin/pages/Advertisements")
);
const AdminReports = lazy(() =>
  import("./features/InstituteAdmin/pages/Reports")
);
const AdminSettings = lazy(() =>
  import("./features/InstituteAdmin/pages/Settings")
);
const AdminHelp = lazy(() =>
  import("./features/InstituteAdmin/pages/Help")
);

/* ================= IT ADMIN (OPTIONAL) ================= */
const ITAdminLayout = lazy(() =>
  import("./features/ItAdmin/layouts/ITAdminLayout")
);
const ITAdminDashboard = lazy(() =>
  import("./features/ItAdmin/pages/ITAdminDashboard")
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>

        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ===== AI (Logged-in students only) ===== */}
        <Route
          path="/ai"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <AIAssistant />
            </ProtectedRoute>
          }
        />

        {/* ===== STUDENT (STUDENT ONLY) ===== */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/:classId" element={<ClassGradeSelect />} />
          <Route path="classes/:classId/grade/:gradeId" element={<ClassWorkspace />} />
          <Route
            path="classes/:classId/grade/:gradeId/assignments/:assignmentId"
            element={<AssignmentSubmission />}
          />
          <Route path="live-classes" element={<LiveClasses />} />
          <Route path="recordings" element={<ClassRecordings />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
          <Route path="tests" element={<Tests />} />
          <Route path="results" element={<Results />} />
          <Route path="messages" element={<Messages />} />
          <Route path="questions" element={<Questions />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="todo" element={<Todo />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* ===== TEACHER (TEACHER ONLY) ===== */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={["TEACHER"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherMyClasses />} />
          <Route path="classes/:classId/grade/:gradeId" element={<TeacherGradeWorkspace />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="content" element={<TeacherContent />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="tests" element={<TeacherTests />} />
          <Route path="help" element={<TeacherHelp />} />
        </Route>

        {/* ===== INSTITUTE ADMIN (ADMIN ONLY) ===== */}
        <Route
          path="/instituteadmin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <InstituteAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="admins" element={<AdminAdmins />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="advertisements" element={<AdminAdvertisements />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="help" element={<AdminHelp />} />
        </Route>

        {/* ===== IT ADMIN (OPTIONAL) ===== */}
        <Route
          path="/it-admin"
          element={
            <ProtectedRoute roles={["IT_ADMIN"]}>
              <ITAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ITAdminDashboard />} />
        </Route>

      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
