import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Building2,
  User,
  Hash,
  Briefcase,
  BadgeDollarSign,
  Wrench,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const DOJ_ENABLED_BILLING = "148435";


export default function EditServiceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const {user}=useAuth();
  const basePath=user.role==="ADMIN"?"/admin":"/staff";
  const [organizations, setOrganizations] = useState([]);
  const [services, setServices] = useState([]);
  const [fees, setFees] = useState([]);
const [zeroDojFeeId, setZeroDojFeeId] = useState("");

  const [form, setForm] = useState({
    serviceDate: "",
    organizationId: "",
    applicantName: "",
    billingNumber: "",
    confirmBillingNumber: "",
    serviceId: "",
    feeId: "",
    quantity: 1,
  });

  /* ---------- Load dropdowns + record ---------- */
  useEffect(() => {
    Promise.all([
      api.get("/organizations/staff"),
      api.get("/services/staff"),
      api.get("/fees/staff"),
      api.get(`/service-records/${id}`),
    ])
      .then(([orgs, servs, fees, record]) => {
        setOrganizations(orgs.data);
        setServices(servs.data);
       setFees(fees.data);

// find DOJ-1 ($0)
const zeroFee = fees.data.find(
  (f) => f.amount === 0 && f.label === "DOJ-1"
);

if (zeroFee) {
  setZeroDojFeeId(zeroFee._id);
}


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
          confirmBillingNumber: r.billingNumber,
          serviceId: r.serviceId,
          feeId: r.feeId,
          quantity: r.quantity,
        });
      })
      .catch(() => {
        setError("Failed to load record");
        toast.error("Failed to load record");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (form.billingNumber !== form.confirmBillingNumber) {
   toast.error("Billing numbers do not match");
   return;
 }
    setSaving(true);
    setError("");

    try {
      await api.put(`/service-records/${id}`, form);

      toast.success("Service record updated successfully");

      navigate(`${basePath}/my-entries`);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Update failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };
 const billingMismatch =
  form.confirmBillingNumber.length > 0 &&
  form.billingNumber !== form.confirmBillingNumber;

const maskedValue = (value, length = 6) =>
  value + "X".repeat(Math.max(0, length - value.length));
const isDojDisabled = form.billingNumber !== DOJ_ENABLED_BILLING;
useEffect(() => {
  if (isDojDisabled && zeroDojFeeId) {
    setForm((prev) => ({
      ...prev,
      feeId: zeroDojFeeId || "",
    }));
  }
}, [isDojDisabled, zeroDojFeeId]);

  if (loading) return <PageLoader />;

  if (error)
    return (
      <div className="max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex gap-2">
        <AlertTriangle size={18} />
        {error}
      </div>
    );

   
const blockClipboard = (e) => {
  e.preventDefault();
};

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
        autoComplete="off"
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6"
      >
        {/* Chrome autofill trap */}
<input
  type="text"
  name="username"
  autoComplete="username"
  className="hidden"
/>
<input
  type="password"
  name="password"
  autoComplete="current-password"
  className="hidden"
/>

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
    type="text"
    name="applicantName"
    value={form.applicantName}
    placeholder="e.g. Sample Applicant"
    onChange={(e) => {
      const value = e.target.value
        .replace(/[^a-zA-Z\s]/g, "")
        .toUpperCase();

      handleChange({
        target: { name: "applicantName", value },
      });
    }}
    className={inputClass}
    required
  />
</Field>


        <Field icon={<Hash size={16} />} label="Billing Number (6 digits)">
  <div className="relative">
    <input
      type="text"
      name="billingNumber"
      autoComplete="new-password"
      value={form.billingNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        handleChange({
          target: { name: "billingNumber", value },
        });
      }}
      onPaste={blockClipboard}
  onCopy={blockClipboard}
  onCut={blockClipboard}
  onDrop={blockClipboard}
      inputMode="numeric"
      maxLength={6}
      className={`
        ${inputClass}
        bg-transparent relative z-10
        ${
          form.billingNumber.length < 6
            ? "text-transparent caret-black"
            : "text-black"
        }
      `}
      required
    />

    {form.billingNumber.length < 6 && (
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center z-0">
        <span className="font-mono text-gray-400">
          {maskedValue(form.billingNumber)}
        </span>
      </div>
    )}
  </div>
</Field>
<Field icon={<Hash size={16} />} label="Confirm Billing Number">
  <div className="relative">
    <input
      type="text"
      name="confirmBillingNumber"
      autoComplete="new-password"
      value={form.confirmBillingNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        handleChange({
          target: { name: "confirmBillingNumber", value },
        });
      }}
      onPaste={blockClipboard}
  onCopy={blockClipboard}
  onCut={blockClipboard}
  onDrop={blockClipboard}
      inputMode="numeric"
      maxLength={6}
      className={`
        ${inputClass}
        bg-transparent relative z-10
        ${
          form.confirmBillingNumber.length < 6
            ? "text-transparent caret-black"
            : "text-black"
        }
        ${
          billingMismatch
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : ""
        }
      `}
      required
    />

    {form.confirmBillingNumber.length < 6 && (
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center z-0">
        <span className="font-mono text-gray-400">
          {maskedValue(form.confirmBillingNumber)}
        </span>
      </div>
    )}
  </div>

  {billingMismatch && (
    <p className="mt-1 text-sm text-red-600">
      Billing numbers do not match
    </p>
  )}
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
    value={form.feeId || ""}
    onChange={handleChange}
    disabled={isDojDisabled}
    className={`
      ${inputClass}
      ${isDojDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
    `}
  >
    {isDojDisabled ? (
      <option value={zeroDojFeeId || ""}>$0</option>
    ) : (
      <>
        <option value="">Select fee</option>
        {fees.map((f) => (
          <option key={f._id} value={f._id}>
             (${f.amount})
          </option>
        ))}
      </>
    )}
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
            onClick={() => navigate(`${basePath}/my-entries`)}
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
