import { apiFetch } from "./api";

export const fetchStudentClasses = () => {
  return apiFetch("/api/student/classes");
};
