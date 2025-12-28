import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  Lock,
  RefreshCcw,
} from "lucide-react";
import api from "../../api/axios";

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/staff/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s a quick overview and important guidelines for your work
        </p>
      </div>

      {/* SNAPSHOT */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Entries Today"
          value={loading ? null : stats.entriesToday}
          animated
        />
        <StatCard
          label="This Week"
          value={loading ? null : stats.entriesThisWeek}
          animated
        />
        <StatCard
          label="Unbilled Entries"
          value={loading ? null : stats.unbilledEntries}
          animated
        />
        <StatCard
          label="Last Entry"
          value={
            loading
              ? "—"
              : stats.lastEntry
              ? formatDateTime(stats.lastEntry)
              : "No entries yet"
          }
        />
      </section>

      {/* INFO / GUIDELINES */}
      <section className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Important Information
        </h2>

        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Lock size={16} className="text-gray-400 mt-0.5" />
            Once an entry is billed, it cannot be edited.
          </li>

          <li className="flex items-start gap-2">
            <Clock size={16} className="text-gray-400 mt-0.5" />
            Please submit service entries on the same day the service is performed.
          </li>

          <li className="flex items-start gap-2">
            <ClipboardList size={16} className="text-gray-400 mt-0.5" />
            Ensure billing numbers are exactly 6 digits before submitting.
          </li>

          <li className="flex items-start gap-2">
            <RefreshCcw size={16} className="text-gray-400 mt-0.5" />
            Before starting a new service entry, refresh the page to ensure the latest active organizations, services, and fees are loaded.
          </li>
        </ul>
      </section>

      {/* FOOTNOTE */}
      <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700">
        This dashboard will show more activity insights as you continue using the system.
      </section>
    </div>
  );
}

/* ===================== */
/* STAT CARD */
/* ===================== */
function StatCard({ label, value, animated = false }) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 text-center">
      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div className="text-2xl font-bold text-gray-800 mt-1">
        {animated ? (
          value === null ? (
            "—"
          ) : (
            <AnimatedNumber value={value} />
          )
        ) : (
          value
        )}
      </div>
    </div>
  );
}

/* ===================== */
/* ANIMATED NUMBER */
/* ===================== */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") return;

    let startTime = null;
    const duration = 1400; // ⬅ slower = smoother
    const startValue = 0;
    const endValue = value;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      // ⬇ very smooth ease-out (Apple-style)
      const eased =
        1 - Math.pow(1 - progress, 4);

      const current =
        startValue + (endValue - startValue) * eased;

      setDisplay(Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return <span className="transition-transform duration-300">
  {display}
</span>;

}


/* ===================== */
/* HELPERS */
/* ===================== */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
