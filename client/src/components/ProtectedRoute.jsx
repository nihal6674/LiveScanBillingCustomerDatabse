import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // 🔇 NO UI during loading (prevents flash)
  if (loading) return null;

  // ❌ Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
