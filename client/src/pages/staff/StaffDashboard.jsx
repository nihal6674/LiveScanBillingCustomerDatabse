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
    variant="blue"
  />
  <StatCard
    label="This Week"
    value={loading ? null : stats.entriesThisWeek}
    animated
    variant="green"
  />
  <StatCard
    label="Unbilled Entries"
    value={loading ? null : stats.unbilledEntries}
    animated
    variant="orange"
  />
  <StatCard
  label="Last Entry"
  value={
    loading
      ? "—"
      : stats.lastEntry
      ? (
          <span
            title={formatDateTime(stats.lastEntry)}
            className="text-sm text-gray-600"
          >
            {timeAgo(stats.lastEntry)}
          </span>
        )
      : "No entries yet"
  }
  variant="red"
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
function StatCard({ label, value, animated = false, variant = "blue" }) {
  const styles = {
    blue: {
      border: "border-t-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    green: {
      border: "border-t-green-500",
      text: "text-green-600",
      bg: "bg-green-50",
    },
    orange: {
      border: "border-t-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
    },
    purple: {
      border: "border-t-purple-500",
      text: "text-purple-600",
      bg: "bg-purple-50",
    },
     red: {
    border: "border-t-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  };

  const theme = styles[variant];

  return (
    <div
      className={`
        bg-white rounded-xl shadow border border-gray-100
        border-t-4 ${theme.border}
        p-4 text-center
        transition hover:shadow-md
      `}
    >
      <div className="text-sm text-gray-500">
        {label}
      </div>

      <div
        className={`text-2xl font-bold mt-1 ${theme.text}`}
      >
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

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return `${days} days ago`;
}

