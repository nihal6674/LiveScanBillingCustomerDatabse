import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StaffLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-lg">Staff Portal</h1>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-200 px-6 py-2 flex gap-4 text-sm">
        <NavLink
          to="/staff"
          end
          className={({ isActive }) =>
            isActive ? "font-bold" : ""
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/staff/service-entry"
          className={({ isActive }) =>
            isActive ? "font-bold" : ""
          }
        >
          Service Entry
        </NavLink>
        <NavLink to="/staff/my-entries">My Entries</NavLink>

      </nav>

      {/* Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
