import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

const navItem =
  "px-4 py-3 rounded-lg transition flex items-center text-base";
const activeNav =
  "bg-blue-50 text-blue-600 font-semibold";
const inactiveNav =
  "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

export default function AdminLayout() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50
          w-64 h-full bg-white border-r
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-500">
                Management Console
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-5 space-y-2">
          {[
            ["Dashboard", "/admin"],
            ["Organizations", "/admin/organizations"],
            ["Services", "/admin/services"],
            ["DOJ / FBI Fees", "/admin/fees"],
            ["Technicians", "/admin/technicians"],
            ["Export", "/admin/export"],
            ["Export History", "/admin/export-history"],
          ].map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNav : inactiveNav}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-4 py-4 border-t bg-gray-50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center
                       px-4 py-3 rounded-lg
                       text-base font-semibold
                       bg-red-600 text-white
                       hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE TOP BAR (FIXED) */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-700 text-2xl font-bold"
          >
            ☰
          </button>

          <div className="ml-4 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              Admin Panel
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pt-20 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
