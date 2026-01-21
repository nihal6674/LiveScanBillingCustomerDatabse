import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { formatMMDDYYYYForFile } from "../../utils/formatMMDDYYYYForFile";

export default function Export() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format] = useState("csv");
  const [loading, setLoading] = useState(false);

  // 🏢 Organizations
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState([]);
  const [selectAll, setSelectAll] = useState(true);

  // 🔄 Fetch organizations
  useEffect(() => {
    api
      .get("/organizations/staff")
      .then((res) => setOrganizations(res.data))
      .catch(() => toast.error("Failed to load organizations"));
  }, []);

  const handleExport = async () => {
    if (loading) return;

    if (!startDate || !endDate) {
      toast.error("Please select a valid date range");
      return;
    }

    if (!selectAll && selectedOrgIds.length === 0) {
      toast.error("Please select at least one organization");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/export/monthly",
        {
          startDate,
          endDate,
          format,
          selectAll,
          organizationIds: selectAll ? [] : selectedOrgIds,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `LiveScan_HouseAccounts_${formatMMDDYYYYForFile(
        startDate
      )}_to_${formatMMDDYYYYForFile(endDate)}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Export completed successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "No unbilled services found"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleOrg = (id) => {
    setSelectedOrgIds((prev) =>
      prev.includes(id)
        ? prev.filter((o) => o !== id)
        : [...prev, id]
    );
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
        {loading ? (
          <SkeletonBlock />
        ) : (
          <>
            <Field label="Start Date" value={startDate} onChange={setStartDate} />
            <Field label="End Date" value={endDate} onChange={setEndDate} />

            {/* ORGANIZATION SELECTION */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Organizations
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    setSelectedOrgIds([]);
                  }}
                />
                Select all organizations
              </label>

              {!selectAll && (
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {organizations.map((org) => (
                    <label
                      key={org._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrgIds.includes(org._id)}
                        onChange={() => toggleOrg(org._id)}
                      />
                      {org.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* FORMAT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Export Format
              </label>
              <select
                value={format}
                disabled
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-50"
              >
                <option value="csv">CSV</option>
              </select>
            </div>
          </>
        )}

        {/* WARNING */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="font-semibold mb-1">⚠ Please note</div>
          Exporting will <strong>mark records as billed</strong>. This action
          cannot be undone.
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleExport}
          disabled={loading}
          className="
            w-full flex items-center justify-center gap-2
            bg-blue-600 text-white font-semibold
            py-3 rounded-lg
            hover:bg-blue-700
            disabled:opacity-50
            transition
          "
        >
          {loading ? <ButtonLoader text="Exporting…" /> : "Export & Mark as Billed"}
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
      <div className="h-20 bg-gray-200 rounded-lg" />
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
