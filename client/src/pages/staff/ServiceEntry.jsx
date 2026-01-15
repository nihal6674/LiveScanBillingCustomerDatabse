import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
const DOJ_DISABLED_BILLING = "148435";

import {
  Calendar,
  Building2,
  User,
  Hash,
  Briefcase,
  BadgeDollarSign,
  Wrench,
  Layers,
} from "lucide-react";

export default function ServiceEntry() {
  const [organizations, setOrganizations] = useState([]);
  const [services, setServices] = useState([]);
  const [fees, setFees] = useState([]);
  const [zeroDojFeeId, setZeroDojFeeId] = useState("");

  const { user } = useAuth();
  console.log(user);
  const [form, setForm] = useState({
    serviceDate: new Date().toISOString().slice(0, 10),
    organizationId: "",
    applicantName: "",
    billingNumber: "",
    confirmBillingNumber: "", // 👈 NEW
    serviceId: "",
    feeId: "",
    technicianId: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);

  /* ---------- Load dropdown data ---------- */
  useEffect(() => {
    Promise.all([
      api.get("/organizations/staff"),
      api.get("/services/staff"),
      api.get("/fees/staff"),
    ])
      .then(([orgs, servs, feesRes]) => {
        setOrganizations(orgs.data);
        setServices(servs.data);
        setFees(feesRes.data);
        if (servs.data.length === 1) {
          setForm((prev) => ({
            ...prev,
            serviceId: servs.data[0]._id,
          }));
        }

        const zeroFee = feesRes.data.find(
          (f) => f.amount === 0 && f.label === "DOJ-1"
        );

        if (zeroFee) {
          setZeroDojFeeId(zeroFee._id);
        }
      })
      .catch(() => toast.error("Failed to load dropdown data"));
  }, []);

  /* ---------- Handle input ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.billingNumber !== form.confirmBillingNumber) {
      toast.error("Billing numbers do not match");
      return;
    }

    if (form.billingNumber.length !== 6) {
      toast.error("Billing number must be exactly 6 digits");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      // 🔐 Normalize payload (backend-safe)
      const payload = {
        ...form,
        feeId:
          form.billingNumber !== DOJ_DISABLED_BILLING
            ? zeroDojFeeId
            : form.feeId,
      };

      await api.post("/service-records", payload);

      toast.success("Service recorded successfully");

      // ✅ Reset to CLEAN state (no assumptions)
      setForm((prev) => ({
        ...prev,
        organizationId: "",
        applicantName: "",
        billingNumber: "",
        confirmBillingNumber: "",
        feeId: "", // ← IMPORTANT
        quantity: 1,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit service");
    } finally {
      setLoading(false);
    }
  };

  const billingMismatch =
    form.confirmBillingNumber.length > 0 &&
    form.billingNumber !== form.confirmBillingNumber;
  const billingCharCount = form.billingNumber.length;
  const maskedValue = (value, length = 6) =>
    value + "X".repeat(Math.max(0, length - value.length));
  const isDojDisabled = form.billingNumber !== DOJ_DISABLED_BILLING;
  useEffect(() => {
    if (isDojDisabled && zeroDojFeeId) {
      setForm((prev) => ({
        ...prev,
        feeId: zeroDojFeeId, // ✅ ALWAYS SEND VALID FEE
      }));
    }
  }, [isDojDisabled, zeroDojFeeId]);

  const blockClipboard = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Service Entry</h1>
        <p className="text-gray-500 mt-1">Record a new live scan service</p>
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
          name="fake-billing"
          autoComplete="username"
          className="hidden"
        />

        {/* DATE */}
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

        {/* ORGANIZATION */}
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

        {/* APPLICANT */}
        <Field icon={<User size={16} />} label="Applicant Name">
          <input
            type="text"
            name="applicantName"
            value={form.applicantName}
            placeholder="e.g. Sample Applicant"
            onChange={(e) => {
              // allow only letters and spaces
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

        {/* BILLING NUMBER */}
        <Field icon={<Hash size={16} />} label="Billing Number (6 digits)">
          <div className="relative">
            {/* REAL INPUT */}
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

            {/* MASKED PLACEHOLDER (INSIDE INPUT) */}
            {form.billingNumber.length < 6 && (
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center z-0">
                <span className="font-mono text-black">
                  {maskedValue(form.billingNumber)}
                </span>
              </div>
            )}
          </div>
        </Field>

        {/* CONFIRM BILLING NUMBER */}
        <Field icon={<Hash size={16} />} label="Confirm Billing Number">
          <div className="relative">
            {/* REAL INPUT */}
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

            {/* MASKED PLACEHOLDER (INSIDE INPUT) */}
            {form.confirmBillingNumber.length < 6 && (
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center z-0">
                <span className="font-mono text-black">
                  {maskedValue(form.confirmBillingNumber)}
                </span>
              </div>
            )}
          </div>

          {/* INLINE ERROR */}
          {billingMismatch && (
            <p className="mt-1 text-sm text-red-600">Numbers do not match</p>
          )}
        </Field>

        {/* SERVICE */}
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

        {/* DOJ / FBI Fee */}
        <Field icon={<BadgeDollarSign size={16} />} label="DOJ / FBI Fee">
          <select
            name="feeId"
            value={form.feeId}
            onChange={handleChange}
            disabled={isDojDisabled}
            className={`
      ${inputClass}
      ${isDojDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
    `}
          >
            {isDojDisabled ? (
              <option value={zeroDojFeeId}>$0</option>
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

        {/* TECHNICIAN
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
        </Field> */}

        {/* TECHNICIAN */}
        <Field icon={<Wrench size={16} />} label="Technician">
          <input
            value={user?.name || ""}
            disabled
            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
          />
        </Field>

        {/* QUANTITY */}
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
