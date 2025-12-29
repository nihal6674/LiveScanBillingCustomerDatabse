import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  // 🔇 Prevent flash while auth resolves
  if (loading) return null;

  // Already logged in → redirect by role
  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/staff"}
        replace
      />
    );
  }

  // Not logged in → allow access
  return children;
}
