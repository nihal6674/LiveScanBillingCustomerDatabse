import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Calendar,
  ArrowRight,
  Layers,
  User,
  FileText,
} from "lucide-react";

export default function ExportHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/export/history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Export History
        </h1>
        <p className="text-gray-500 mt-1">
          Monthly billing exports overview
        </p>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {loading ? (
          <TableSkeleton />
        ) : history.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-left">Format</th>
                <th className="px-4 py-3 text-left">Records</th>
                <th className="px-4 py-3 text-left">User</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {history.map((h) => (
                <tr key={h._id} className="hover:bg-gray-50 transition">
                  {/* Export Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar size={16} />
                      {new Date(h.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Period */}
                  <td className="px-4 py-3">
                    <PeriodPill
                      start={h.startDate}
                      end={h.endDate}
                    />
                  </td>

                  {/* Format */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                      <FileText size={14} />
                      {h.format.toUpperCase()}
                    </span>
                  </td>

                  {/* Records */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-green-700">
                      <Layers size={14} />
                      {h.recordCount}
                    </span>
                  </td>

                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={14} />
                      {h.exportedBy?.email || "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <CardSkeleton />
        ) : history.length === 0 ? (
          <EmptyState />
        ) : (
          history.map((h) => (
            <div
              key={h._id}
              className="bg-white rounded-xl shadow border border-gray-100 p-4 space-y-4"
            >
              {/* Top row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Calendar size={16} />
                  {new Date(h.createdAt).toLocaleDateString()}
                </div>

                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                  {h.format.toUpperCase()}
                </span>
              </div>

              {/* Period */}
              <PeriodPill
                start={h.startDate}
                end={h.endDate}
              />

              {/* Bottom row */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <Layers size={16} />
                  {h.recordCount} records
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <User size={16} />
                  <span className="truncate max-w-[140px]">
                    {h.exportedBy?.email || "—"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ===================== */
/* PERIOD PILL */
/* ===================== */

function PeriodPill({ start, end }) {
  return (
    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border text-sm">
      <Calendar size={14} className="text-gray-500" />
      <span className="text-gray-700">
        {new Date(start).toLocaleDateString()}
      </span>

      <ArrowRight size={14} className="text-gray-400" />

      <Calendar size={14} className="text-gray-500" />
      <span className="text-gray-700">
        {new Date(end).toLocaleDateString()}
      </span>
    </div>
  );
}

/* ===================== */
/* EMPTY STATE */
/* ===================== */

function EmptyState() {
  return (
    <div className="text-center py-12 text-gray-500">
      No exports have been performed yet.
    </div>
  );
}

/* ===================== */
/* SKELETONS */
/* ===================== */

function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, j) => (
            <div
              key={j}
              className="h-4 bg-gray-200 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow border p-4 space-y-3"
        >
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="h-4 bg-gray-200 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
