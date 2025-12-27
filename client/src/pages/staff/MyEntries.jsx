import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyEntries() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadRecords = () => {
    setLoading(true);
    api
      .get("/service-records/my")
      .then((res) => setRecords(res.data))
      .catch(() => setError("Failed to load records"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRecords();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Entries</h1>

      {error && <p className="text-red-600">{error}</p>}

      {records.length === 0 ? (
        <p className="text-gray-500">No entries found.</p>
      ) : (
        <table className="w-full bg-white border rounded shadow text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 border">Date</th>
      <th className="p-2 border">Organization</th>
      <th className="p-2 border">Applicant</th>
      <th className="p-2 border">Billing #</th>
      <th className="p-2 border">Service</th>
      <th className="p-2 border">Fee</th>
      <th className="p-2 border">Qty</th>
      <th className="p-2 border">Service $</th>
      <th className="p-2 border">Fee $</th>
      <th className="p-2 border">Total $</th>
      <th className="p-2 border">Technician</th>
      <th className="p-2 border">Billed</th>
      <th className="p-2 border">Action</th>
    </tr>
  </thead>

  <tbody>
    {records.map((r) => {
      const total =
        (r.serviceRate + r.feeAmount) * r.quantity;

      return (
        <tr key={r._id} className="hover:bg-gray-50">
          <td className="p-2 border">
            {new Date(r.serviceDate).toLocaleDateString()}
          </td>
          <td className="p-2 border">{r.organizationName}</td>
          <td className="p-2 border">{r.applicantName}</td>
          <td className="p-2 border">{r.billingNumber}</td>
          <td className="p-2 border">{r.serviceName}</td>
          <td className="p-2 border">{r.feeLabel}</td>
          <td className="p-2 border text-center">{r.quantity}</td>
          <td className="p-2 border text-right">
            ${r.serviceRate.toFixed(2)}
          </td>
          <td className="p-2 border text-right">
            ${r.feeAmount.toFixed(2)}
          </td>
          <td className="p-2 border text-right font-medium">
            ${total.toFixed(2)}
          </td>
          <td className="p-2 border">{r.technicianName}</td>
          <td className="p-2 border text-center">
            {r.billed ? "Yes" : "No"}
          </td>
          <td className="p-2 border text-center">
            {r.billed ? (
              <span className="text-gray-400">Locked</span>
            ) : (
              <button
                className="text-blue-600 underline"
                onClick={() =>
                  navigate(`/staff/edit/${r._id}`)
                }
              >
                Edit
              </button>
            )}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

      )}
    </div>
  );
}
