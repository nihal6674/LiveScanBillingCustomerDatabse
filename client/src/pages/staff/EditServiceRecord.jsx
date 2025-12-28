import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  AlertTriangle,
} from "lucide-react";

export default function EditServiceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [organizations, setOrganizations] = useState([]);
  const [services, setServices] = useState([]);
  const [fees, setFees] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    serviceDate: "",
    organizationId: "",
    applicantName: "",
    billingNumber: "",
    serviceId: "",
    feeId: "",
    technicianId: "",
    quantity: 1,
  });

  /* ---------- Load dropdowns + record ---------- */
  useEffect(() => {
    Promise.all([
      api.get("/organizations/staff"),
      api.get("/services/staff"),
      api.get("/fees/staff"),
      api.get("/technicians/staff"),
      api.get(`/service-records/${id}`),
    ])
      .then(([orgs, servs, fees, techs, record]) => {
        setOrganizations(orgs.data);
        setServices(servs.data);
        setFees(fees.data);
        setTechnicians(techs.data);

        const r = record.data;
        if (r.billed) {
          setError("This record is billed and cannot be edited.");
          return;
        }

        setForm({
          serviceDate: r.serviceDate.slice(0, 10),
          organizationId: r.organizationId,
          applicantName: r.applicantName,
          billingNumber: r.billingNumber,
          serviceId: r.serviceId,
          feeId: r.feeId,
          technicianId: r.technicianId,
          quantity: r.quantity,
        });
      })
      .catch(() => setError("Failed to load record"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      await api.put(`/service-records/${id}`, form);
      navigate("/staff/my-entries");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error)
    return (
      <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex gap-2">
        <AlertTriangle size={18} />
        {error}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Service Record
        </h1>
        <p className="text-gray-500 mt-1">
          Modify details before billing
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6"
      >
        <Field icon={<Calendar size={16} />} label="Service Date">
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </Field>

        <Field icon={<Building2 size={16} />} label="Organization">
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

        <Field icon={<User size={16} />} label="Applicant Name">
          <input
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </Field>

        <Field icon={<Hash size={16} />} label="Billing Number">
          <input
            name="billingNumber"
            value={form.billingNumber}
            onChange={handleChange}
            pattern="\d{6}"
            className={inputClass}
            required
          />
        </Field>

        <Field icon={<Briefcase size={16} />} label="Service">
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

        <Field icon={<BadgeDollarSign size={16} />} label="DOJ / FBI Fee">
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

        <Field icon={<Wrench size={16} />} label="Technician">
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

        <Field icon={<Layers size={16} />} label="Quantity">
          <select
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
          >
            <option value={1}>1</option>
          </select>
        </Field>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="
              flex-1 h-11 rounded-lg
              bg-blue-600 text-white font-semibold
              hover:bg-blue-700
              disabled:opacity-50
              flex items-center justify-center
            "
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/staff/my-entries")}
            className="
              flex-1 h-11 rounded-lg
              border border-gray-300
              text-gray-700 font-semibold
              hover:bg-gray-50
            "
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===================== */
/* FIELD */
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

/* ===================== */
/* LOADER */
/* ===================== */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-gray-600 font-medium">
          Loading record…
        </span>
      </div>
    </div>
  );
}
