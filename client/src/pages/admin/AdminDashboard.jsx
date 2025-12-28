import { useEffect, useState, useRef } from "react";
import {
  Calendar,
  Package,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Quick insights into system activity and billing
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Unbilled Services" value={stats.unbilledCount} color="red" />
          <StatCard title="Entries This Month" value={stats.entriesThisMonth} color="blue" />
          <StatCard title="Active Organizations" value={stats.activeOrganizations} color="green" />
          <StatCard title="Suspended Organizations" value={stats.suspendedOrganizations} color="yellow" />
        </div>
      </section>

      {/* BILLING STATUS */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Billing Status
        </h2>

        <Row icon={<Calendar className="text-blue-500" />} label="Last Export">
          {stats.lastExportDate || "Not yet exported"}
        </Row>

        <Row icon={<Package className="text-indigo-500" />} label="Records Exported">
          {stats.lastExportCount || 0}
        </Row>

        <Row icon={<FileText className="text-purple-500" />} label="Unbilled Remaining">
          {stats.unbilledCount}
        </Row>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Zap className="text-orange-500" />
            Status
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              stats.unbilledCount > 0
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {stats.unbilledCount > 0 ? "Ready for export" : "All clear"}
          </span>
        </div>
      </section>

      {/* WARNINGS & ALERTS (RESTORED) */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Warnings & Alerts
        </h2>

        <ul className="space-y-3">
          {stats.suspendedOrganizations > 0 && (
            <li className="flex items-center gap-3 text-red-600 font-medium">
              <AlertTriangle size={18} />
              {stats.suspendedOrganizations} organization(s) are suspended.
            </li>
          )}

          {stats.unbilledOlderThan30 > 0 && (
            <li className="flex items-center gap-3 text-red-600 font-medium">
              <AlertTriangle size={18} />
              {stats.unbilledOlderThan30} unbilled records older than 30 days.
            </li>
          )}

          {!stats.exportDoneThisMonth && (
            <li className="flex items-center gap-3 text-red-600 font-medium">
              <AlertTriangle size={18} />
              No export performed this month.
            </li>
          )}

          {stats.suspendedOrganizations === 0 &&
            stats.unbilledOlderThan30 === 0 &&
            stats.exportDoneThisMonth && (
              <li className="flex items-center gap-3 text-green-600 font-semibold">
                <CheckCircle size={18} />
                No issues detected.
              </li>
            )}
        </ul>
      </section>
    </div>
  );
}

/* ===================== */
/* STAT CARD (SAFE ANIMATION) */
/* ===================== */

function StatCard({ title, value, color }) {
  const accent = {
    red: "from-red-500 to-red-400 text-red-600",
    blue: "from-blue-500 to-blue-400 text-blue-600",
    green: "from-green-500 to-green-400 text-green-600",
    yellow: "from-yellow-500 to-yellow-400 text-yellow-600",
  };

  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const overshoot = Math.round(value * 1.08);
    const durationUp = 900;
    const durationDown = 400;
    let startTime = null;

    const animateUp = (t) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / durationUp, 1);
      setDisplay(Math.round(overshoot * p));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animateUp);
      } else {
        startTime = null;
        rafRef.current = requestAnimationFrame(animateDown);
      }
    };

    const animateDown = (t) => {
      if (!startTime) startTime = t;
      const p = Math.min((t - startTime) / durationDown, 1);
      setDisplay(Math.round(overshoot + (value - overshoot) * p));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animateDown);
      }
    };

    rafRef.current = requestAnimationFrame(animateUp);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${accent[color]}`} />
      <div className="text-sm font-medium text-gray-500 mb-2">{title}</div>
      <div className={`text-4xl font-bold ${accent[color]}`}>{display}</div>
    </div>
  );
}

/* ===================== */
/* ROW */
/* ===================== */

function Row({ icon, label, children }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        {label}
      </div>
      <span className="font-semibold text-gray-800">{children}</span>
    </div>
  );
}

/* ===================== */
/* LOADER */
/* ===================== */

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
