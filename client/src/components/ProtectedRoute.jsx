import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔁 Redirect on refresh if user hits "/"
  if (location.pathname === "/") {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/staff"}
        replace
      />
    );
  }

  // Role protected route
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
