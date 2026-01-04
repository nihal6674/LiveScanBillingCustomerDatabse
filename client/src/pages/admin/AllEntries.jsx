import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Calendar,
  Building2,
  User,
  Hash,
  Pencil,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import { formatDate } from "../../utils/date";

export default function AllEntries() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRecords = () => {
    setLoading(true);
    api
      .get("/service-records") // 🔑 ADMIN: all records
      .then((res) => setRecords(res.data))
      .catch(() => toast.error("Failed to load records"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          All Entries
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage all service entries across staff
        </p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-6 text-gray-500">
          No entries found.
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Applicant</th>
                  <th className="px-4 py-3 text-left">Entered By</th>
                  <th className="px-4 py-3 text-left">Billing #</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-right">Total</th>

                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {records.map((r) => {
                  const total =
                    (r.serviceRate + r.feeAmount) * r.quantity;

                  return (
                    <tr key={r._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        {formatDate(r.serviceDate)}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {r.organizationName}
                      </td>

                      <td className="px-4 py-3">
                        {r.applicantName}
                      </td>

                      <td className="px-4 py-3">
  {r.enteredBy?.name || r.enteredBy?.email || "—"}
</td>
                      <td className="px-4 py-3">
                        {r.billingNumber}
                      </td>

                      <td className="px-4 py-3">
                        {r.serviceName}
                      </td>

                      <td className="px-4 py-3 text-right font-semibold">
                        ${total.toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {r.billed ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle size={14} /> Billed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                            <XCircle size={14} /> Unbilled
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {r.billed ? (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <Lock size={14} /> Locked
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/admin/edit/${r._id}`)
                            }
                            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="lg:hidden space-y-4">
            {records.map((r) => {
              const total =
                (r.serviceRate + r.feeAmount) * r.quantity;

              return (
                <div
                  key={r._id}
                  className="bg-white rounded-xl shadow border p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800">
                      {r.serviceName}
                    </div>
                    <span className="font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <InfoRow icon={<Calendar size={14} />} label="Date">
                    {formatDate(r.serviceDate)}
                  </InfoRow>

                  <InfoRow icon={<Building2 size={14} />} label="Org">
                    {r.organizationName}
                  </InfoRow>

                  <InfoRow icon={<User size={14} />} label="Applicant">
                    {r.applicantName}
                  </InfoRow>
                  <InfoRow icon={<User size={14} />} label="Entered By">
  {r.enteredBy?.name || r.enteredBy?.email || "—"}
</InfoRow>

                  <InfoRow icon={<Hash size={14} />} label="Billing #">
                    {r.billingNumber}
                  </InfoRow>

                  <div className="flex justify-between items-center pt-2">
                    {r.billed ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle size={14} /> Billed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <XCircle size={14} /> Unbilled
                      </span>
                    )}

                    {r.billed ? (
                      <span className="flex items-center gap-1 text-gray-400">
                        <Lock size={14} /> Locked
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/admin/edit/${r._id}`)
                        }
                        className="flex items-center gap-1 text-blue-600 font-semibold"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ===================== */
/* INFO ROW */
/* ===================== */
function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-gray-800">
        {children}
      </span>
    </div>
  );
}

/* ===================== */
/* PAGE LOADER */
/* ===================== */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-gray-600 font-medium">
          Loading entries…
        </span>
      </div>
    </div>
  );
}
