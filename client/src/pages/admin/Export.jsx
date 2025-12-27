import { useState } from "react";
import api from "../../api/axios";

export default function Export() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    if (loading) return;

    if (!startDate || !endDate) {
      setMessage("Please select a valid date range.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post(
        "/export/monthly",
        { startDate, endDate, format },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `LiveScan_HouseAccounts_${startDate}_to_${endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage("Export completed successfully.");
    } catch (err) {
      setMessage("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Monthly Export
        </h1>
        <p className="text-gray-500 mt-1">
          Generate billing files for house account services
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-5">
        {/* MESSAGE */}
        {message && (
          <p className="text-sm font-medium text-blue-600">
            {message}
          </p>
        )}

        {/* FORM */}
        {loading ? (
          <SkeletonBlock />
        ) : (
          <>
            <Field
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
            />
            <Field
              label="End Date"
              value={endDate}
              onChange={setEndDate}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </select>
            </div>
          </>
        )}

        {/* WARNING */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="font-semibold mb-1">
            ⚠ Please note
          </div>
          Exporting will <span className="font-semibold">mark records as billed</span>.
          This action cannot be undone.
        </div>

        {/* ACTION BUTTON (LOADER APPLIED) */}
        <button
          onClick={handleExport}
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-2
            bg-blue-600 text-white font-semibold
            py-3 rounded-lg
            hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
          "
        >
          {loading ? (
            <ButtonLoader text="Exporting…" />
          ) : (
            "Export & Mark as Billed"
          )}
        </button>
      </div>
    </div>
  );
}

/* ===================== */
/* FIELD */
/* ===================== */

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* ===================== */
/* SKELETON */
/* ===================== */

function SkeletonBlock() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  );
}

/* ===================== */
/* BUTTON LOADER */
/* ===================== */

function ButtonLoader({ text = "Loading…" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>{text}</span>
    </div>
  );
}
