import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext"
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
  const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const limit = 10;
const [total, setTotal] = useState(0);
const totalPages = Math.ceil(total / limit);

  const {user}=useAuth();
  const basePath=user.role==="ADMIN"?"/admin":"/staff";
  const navigate = useNavigate();

  const loadRecords = async () => {
  setLoading(true);
  try {
    const res = await api.get("/service-records", {
      params: { page, limit, search },
    });

    setRecords(res.data.records);
    setTotal(res.data.total);
  } catch {
    toast.error("Failed to load records");
  } finally {
    setLoading(false);
  }
};


 useEffect(() => {
  const timer = setTimeout(() => {
    loadRecords();
  }, 300);

  return () => clearTimeout(timer);
}, [page, search]);



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
      <input
  value={search}
  onChange={(e) => {
    setPage(1);
    setSearch(e.target.value);
  }}
  placeholder="Search applicant, organization, service, billing #"
  className="w-full md:w-96 mb-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
/>
{loading && (
  <p className="text-sm text-gray-400 mb-2">
    Searching…
  </p>
)}


      {!loading && records.length === 0 ? (
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
                    

                  const enteredById =
  typeof r.enteredBy === "string"
    ? r.enteredBy
    : r.enteredBy?._id;

const userId = user.id; // ✅ THIS IS THE FIX

const canEdit =
  !r.billed &&
  (
    user.role === "ADMIN" ||
    enteredById === userId
  );

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
                        {canEdit ? (
  <button
    onClick={() => navigate(`${basePath}/edit/${r._id}`, {
  state: { from: "all-entries" }
})}
    className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
  >
    <Pencil size={14} /> Edit
  </button>
) : (
  <span className="inline-flex items-center gap-1 text-gray-400">
    <Lock size={14} /> Locked
  </span>
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
             const enteredById =
  typeof r.enteredBy === "string"
    ? r.enteredBy
    : r.enteredBy?._id;

const userId = user.id; // ✅ THIS IS THE FIX

const canEdit =
  !r.billed &&
  (
    user.role === "ADMIN" ||
    enteredById === userId
  );


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

                    {canEdit ? (
  <button
    onClick={() => navigate(`${basePath}/edit/${r._id}`, {
  state: { from: "all-entries" }
})}
    className="flex items-center gap-1 text-blue-600 font-semibold"
  >
    <Pencil size={14} /> Edit
  </button>
) : (
  <span className="flex items-center gap-1 text-gray-400">
    <Lock size={14} /> Locked
  </span>
)}

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* PAGINATION */}
<div className="flex justify-between items-center mt-6 text-sm">
  <span className="text-gray-500">
    Page {page} of {totalPages || 1}
  </span>

  <div className="space-x-2">
    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-3 py-1 border rounded disabled:opacity-40"
    >
      Prev
    </button>

    <button
      disabled={page === totalPages || totalPages === 0}
      onClick={() => setPage(page + 1)}
      className="px-3 py-1 border rounded disabled:opacity-40"
    >
      Next
    </button>
  </div>
</div>

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
