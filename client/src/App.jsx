import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Login from "./auth/Login";
import { Toaster } from "react-hot-toast";


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
import AllEntries from "./pages/admin/AllEntries";




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
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* ---------- PUBLIC ---------- */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />{" "}
          <Route path="/unauthorized" element={<Unauthorized />} />
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
            <Route path="all-entries" element={<AllEntries />} /> 
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
            {/* ✅ STAFF FEATURES FOR ADMIN */}
            <Route path="service-entry" element={<ServiceEntry />} />
            <Route path="my-entries" element={<MyEntries />} />
            <Route path="all-entries" element={<AllEntries />} />
            <Route path="edit/:id" element={<EditServiceRecord />} />

            <Route path="organizations" element={<Organizations />} />
            <Route path="services" element={<Services />} />
            <Route path="fees" element={<Fees />} />
            <Route path="technicians" element={<Technicians />} />
            <Route path="export" element={<Export />} />
            <Route path="export-history" element={<ExportHistory />} />
          </Route>
          {/* ---------- FALLBACK ---------- */}
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
