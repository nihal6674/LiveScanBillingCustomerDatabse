import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ServiceEntry() {
  const [organizations, setOrganizations] = useState([]);
  const [services, setServices] = useState([]);
  const [fees, setFees] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    serviceDate: new Date().toISOString().slice(0, 10),
    organizationId: "",
    applicantName: "",
    billingNumber: "",
    serviceId: "",
    feeId: "",
    technicianId: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------- Load dropdown data ---------- */
  useEffect(() => {
    Promise.all([
      api.get("/organizations/staff"),
      api.get("/services/staff"),
      api.get("/fees/staff"),
      api.get("/technicians/staff"),
    ])
      .then(([orgs, servs, fees, techs]) => {
        setOrganizations(orgs.data);
        setServices(servs.data);
        setFees(fees.data);
        setTechnicians(techs.data);
      })
      .catch(() => setMessage("Failed to load dropdown data"));
  }, []);

  /* ---------- Handle input ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/service-records", form);
      setMessage("Service recorded successfully");

      // Reset (keep date)
      setForm((prev) => ({
        ...prev,
        applicantName: "",
        billingNumber: "",
        serviceId: "",
        feeId: "",
        technicianId: "",
        quantity: 1,
      }));
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to submit service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Service Entry
      </h1>

      {message && (
        <div className="mb-4 text-sm text-blue-600">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Date */}
        <div>
          <label className="block text-sm font-medium">Service Date</label>
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Organization */}
        <div>
          <label className="block text-sm font-medium">Organization</label>
          <select
            name="organizationId"
            value={form.organizationId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {organizations.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Applicant */}
        <div>
          <label className="block text-sm font-medium">Applicant Name</label>
          <input
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Billing Number */}
        <div>
          <label className="block text-sm font-medium">
            Billing Number (6 digits)
          </label>
          <input
            name="billingNumber"
            value={form.billingNumber}
            onChange={handleChange}
            pattern="\d{6}"
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium">Service</label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fee */}
        <div>
          <label className="block text-sm font-medium">DOJ / FBI Fee</label>
          <select
            name="feeId"
            value={form.feeId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {fees.map((f) => (
              <option key={f._id} value={f._id}>
                {f.label} (${f.amount})
              </option>
            ))}
          </select>
        </div>

        {/* Technician */}
        <div>
          <label className="block text-sm font-medium">Technician</label>
          <select
            name="technicianId"
            value={form.technicianId}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {technicians.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <select
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>1</option>
          </select>
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Service"}
        </button>
      </form>
    </div>
  );
}
