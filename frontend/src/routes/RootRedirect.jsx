import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "STUDENT":
      return <Navigate to="/student" replace />;
    case "TEACHER":
      return <Navigate to="/teacher" replace />;
    case "ADMIN":
      return <Navigate to="/instituteadmin" replace />;
    case "IT_ADMIN":
      return <Navigate to="/it-admin" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default RootRedirect;
