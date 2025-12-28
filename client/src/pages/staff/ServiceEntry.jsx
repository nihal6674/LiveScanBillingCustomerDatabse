import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Calendar,
  Building2,
  User,
  Hash,
  Briefcase,
  BadgeDollarSign,
  Wrench,
  Layers,
  CheckCircle,
} from "lucide-react";

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
  const [error, setError] = useState("");

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
      .catch(() => setError("Failed to load dropdown data"));
  }, []);

  /* ---------- Handle input ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");

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
      setError(
        err.response?.data?.message || "Failed to submit service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Service Entry
        </h1>
        <p className="text-gray-500 mt-1">
          Record a new live scan service
        </p>
      </div>

      {/* SUCCESS / ERROR */}
      {message && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <CheckCircle size={16} />
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6"
      >
        {/* DATE */}
        <Field
          icon={<Calendar size={16} />}
          label="Service Date"
        >
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </Field>

        {/* ORGANIZATION */}
        <Field
          icon={<Building2 size={16} />}
          label="Organization"
        >
          <select
            name="organizationId"
            value={form.organizationId}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select organization</option>
            {organizations.map((o) => (
              <option key={o._id} value={o._id}>
                {o.name}
              </option>
            ))}
          </select>
        </Field>

        {/* APPLICANT */}
        <Field
          icon={<User size={16} />}
          label="Applicant Name"
        >
          <input
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            className={inputClass}
            placeholder="Applicant full name"
            required
          />
        </Field>

        {/* BILLING NUMBER */}
        <Field
          icon={<Hash size={16} />}
          label="Billing Number (6 digits)"
        >
          <input
            name="billingNumber"
            value={form.billingNumber}
            onChange={handleChange}
            pattern="\d{6}"
            className={inputClass}
            placeholder="123456"
            required
          />
        </Field>

        {/* SERVICE */}
        <Field
          icon={<Briefcase size={16} />}
          label="Service"
        >
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        {/* FEE */}
        <Field
          icon={<BadgeDollarSign size={16} />}
          label="DOJ / FBI Fee"
        >
          <select
            name="feeId"
            value={form.feeId}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select fee</option>
            {fees.map((f) => (
              <option key={f._id} value={f._id}>
                {f.label} (${f.amount})
              </option>
            ))}
          </select>
        </Field>

        {/* TECHNICIAN */}
        <Field
          icon={<Wrench size={16} />}
          label="Technician"
        >
          <select
            name="technicianId"
            value={form.technicianId}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select technician</option>
            {technicians.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>

        {/* QUANTITY */}
        <Field
          icon={<Layers size={16} />}
          label="Quantity"
        >
          <select
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
          >
            <option value={1}>1</option>
          </select>
        </Field>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-11 rounded-lg
            bg-blue-600 text-white font-semibold
            hover:bg-blue-700
            disabled:opacity-50
            transition
            flex items-center justify-center
          "
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Submit Service"
          )}
        </button>
      </form>
    </div>
  );
}

/* ===================== */
/* REUSABLE FIELD */
/* ===================== */

function Field({ icon, label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ===================== */
/* INPUT CLASS */
/* ===================== */

const inputClass = `
  w-full rounded-lg
  border border-gray-300
  px-3 py-2
  focus:ring-2 focus:ring-blue-500
  focus:border-blue-500
  outline-none
  transition
`;
