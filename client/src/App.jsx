import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./auth/Login";

/* ===== STAFF ===== */
import StaffLayout from "./pages/staff/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ServiceEntry from "./pages/staff/ServiceEntry";
import MyEntries from "./pages/staff/MyEntries";
import EditServiceRecord from "./pages/staff/EditServiceRecord";

/* ===== ADMIN ===== */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Organizations from "./pages/admin/Organizations";
import Fees from "./pages/admin/Fees";
import Services from "./pages/admin/Services";
import Technicians from "./pages/admin/Technicians";
import Export from "./pages/admin/Export";
import ExportHistory from "./pages/admin/ExportHistory";




/* ===== MISC ===== */
function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-bold text-red-600">
        Unauthorized Access
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---------- PUBLIC ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ---------- ROOT REDIRECT ---------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div /> {/* redirect handled in ProtectedRoute */}
              </ProtectedRoute>
            }
          />

          {/* ---------- STAFF ---------- */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute role="STAFF">
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StaffDashboard />} />
            <Route path="service-entry" element={<ServiceEntry />} />
            <Route path="my-entries" element={<MyEntries />} />
            <Route path="edit/:id" element={<EditServiceRecord />} />
          </Route>

          {/* ---------- ADMIN ---------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="services" element={<Services />} />
            <Route path="fees" element={<Fees />} />
            <Route path="technicians" element={<Technicians />} />
            <Route path="export" element={<Export />} />
            <Route path="export-history" element={<ExportHistory />} />

          </Route>

          {/* ---------- FALLBACK ---------- */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-bold">Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
