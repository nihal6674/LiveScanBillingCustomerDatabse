import { useEffect, useState } from "react";
import {
  Calendar,
  Package,
  FileText,
  Zap,
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
          <StatCard
            title="Unbilled Services"
            value={stats.unbilledCount}
            color="red"
          />
          <StatCard
            title="Entries This Month"
            value={stats.entriesThisMonth}
            color="blue"
          />
          <StatCard
            title="Active Organizations"
            value={stats.activeOrganizations}
            color="green"
          />
          <StatCard
            title="Suspended Organizations"
            value={stats.suspendedOrganizations}
            color="yellow"
          />
        </div>
      </section>

      {/* BILLING STATUS */}
      {/* SECTION — BILLING STATUS */}
<section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
  <h2 className="text-xl font-semibold text-gray-800 mb-5">
    Billing Status
  </h2>

  <div className="space-y-4 text-base">
    {/* Last Export */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-gray-600">
        <Calendar size={18} className="text-blue-500" />
        <span>Last Export</span>
      </div>
      <span className="font-semibold text-gray-800">
        {stats.lastExportDate || "Not yet exported"}
      </span>
    </div>

    {/* Records Exported */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-gray-600">
        <Package size={18} className="text-indigo-500" />
        <span>Records Exported</span>
      </div>
      <span className="font-semibold text-gray-800">
        {stats.lastExportCount || 0}
      </span>
    </div>

    {/* Unbilled Remaining */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-gray-600">
        <FileText size={18} className="text-purple-500" />
        <span>Unbilled Remaining</span>
      </div>
      <span className="font-semibold text-gray-800">
        {stats.unbilledCount}
      </span>
    </div>

    {/* Status */}
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center gap-3 text-gray-600">
        <Zap size={18} className="text-orange-500" />
        <span>Status</span>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          stats.unbilledCount > 0
            ? "bg-orange-100 text-orange-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {stats.unbilledCount > 0
          ? "Ready for export"
          : "All clear"}
      </span>
    </div>
  </div>
</section>



      {/* WARNINGS */}
      <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Warnings & Alerts
        </h2>

        <ul className="space-y-3 text-base">
          {stats.suspendedOrganizations > 0 && (
            <li className="text-red-600 font-medium">
              ⚠ {stats.suspendedOrganizations} organization(s) are suspended.
            </li>
          )}

          {stats.unbilledOlderThan30 > 0 && (
            <li className="text-red-600 font-medium">
              ⚠ {stats.unbilledOlderThan30} unbilled records older than 30 days.
            </li>
          )}

          {!stats.exportDoneThisMonth && (
            <li className="text-red-600 font-medium">
              ⚠ No export performed this month.
            </li>
          )}

          {stats.suspendedOrganizations === 0 &&
            stats.unbilledOlderThan30 === 0 &&
            stats.exportDoneThisMonth && (
              <li className="text-green-600 font-semibold">
                ✔ No issues detected.
              </li>
            )}
        </ul>
      </section>
    </div>
  );
}

/* ===================== */
/* LOADER */
/* ===================== */

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-base font-medium text-gray-600">
          Loading dashboard…
        </span>
      </div>
    </div>
  );
}

/* ===================== */
/* STAT CARD */
/* ===================== */

function StatCard({ title, value, color }) {
  const accent = {
    red: "from-red-500 to-red-400 text-red-600",
    blue: "from-blue-500 to-blue-400 text-blue-600",
    green: "from-green-500 to-green-400 text-green-600",
    yellow: "from-yellow-500 to-yellow-400 text-yellow-600",
  };

  return (
    <div
      className="
        relative overflow-hidden
        bg-white rounded-2xl
        border border-gray-100
        p-6
        shadow-lg hover:shadow-2xl
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${accent[color]}`}
      />

      <div className="text-sm font-medium text-gray-500 mb-2">
        {title}
      </div>
      <div className={`text-4xl font-bold ${accent[color]}`}>
        {value}
      </div>
    </div>
  );
}
