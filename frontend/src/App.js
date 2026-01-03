import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PUBLIC ================= */
import Home from "./pages/Home/Home";
import Login from "./features/Auth/Login";
import Signup from "./features/Auth/Signup";

/* ================= STUDENT LAYOUT ================= */
import StudentLayout from "./features/student/layout/StudentLayout";
import Dashboard from "./features/student/dashboard/Dashboard";

/* ================= LEARNING ================= */
import Classes from "./features/student/classes/Classes";
import ClassGradeSelect from "./features/student/classes/ClassGradeSelect";
import ClassWorkspace from "./features/student/classes/ClassWorkspace";
import LiveClasses from "./features/student/classes/LiveClasses";
import ClassRecordings from "./features/student/classes/ClassRecordings";
import AssignmentSubmission from "./features/student/classes/AssignmentSubmission";

/* ================= ASSESSMENTS ================= */
import Assignments from "./features/student/assessments/Assignments";
import Tests from "./features/student/assessments/Tests";
import Results from "./features/student/assessments/Results";

/* ================= COMMUNICATION ================= */
import Messages from "./features/student/communication/Messages";
import Questions from "./features/student/communication/Questions";
import Announcements from "./features/student/communication/Announcements";

/* ================= PLANNING ================= */
import Calendar from "./features/student/productivity/Calendar";
import Todo from "./features/student/productivity/Todo";
import Progress from "./features/student/productivity/Progress";

/* ================= ACCOUNT ================= */
import Profile from "./features/student/profile/Profile";
import Settings from "./features/student/profile/Settings";
import Help from "./features/student/profile/Help";

/* ================= AI ================= */
import AIAssistant from "./features/student/assistant/AIAssistant";

const App = () => (
  <BrowserRouter>
    <Routes>

      {/* ========= PUBLIC ========= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ai" element={<AIAssistant />} />

      {/* ========= STUDENT LMS ========= */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classes" element={<Classes />} />
        <Route path="classes/:classId" element={<ClassGradeSelect />} />
        <Route path="classes/:classId/grade/:gradeId" element={<ClassWorkspace />} />
        <Route path="classes/:classId/grade/:gradeId/assignments/:assignmentId" element={<AssignmentSubmission />} />

        <Route path="live-classes" element={<LiveClasses />} />
        <Route path="recordings" element={<ClassRecordings />} />

        <Route path="assignments" element={<Assignments />} />
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

    </Routes>
  </BrowserRouter>
);

export default App;
