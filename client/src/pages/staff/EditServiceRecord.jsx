import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function EditServiceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
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
          setError("This record is billed and cannot be edited");
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
    setError("");

    try {
      await api.put(`/service-records/${id}`, form);
      navigate("/staff/my-entries");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error)
    return (
      <div className="max-w-xl mx-auto text-red-600">
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Edit Service Record
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <input
          type="date"
          name="serviceDate"
          value={form.serviceDate}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="organizationId"
          value={form.organizationId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Organization</option>
          {organizations.map((o) => (
            <option key={o._id} value={o._id}>
              {o.name}
            </option>
          ))}
        </select>

        <input
          name="applicantName"
          value={form.applicantName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="billingNumber"
          value={form.billingNumber}
          onChange={handleChange}
          pattern="\d{6}"
          required
          className="w-full border p-2 rounded"
        />

        <select
          name="serviceId"
          value={form.serviceId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Service</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="feeId"
          value={form.feeId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Fee</option>
          {fees.map((f) => (
            <option key={f._id} value={f._id}>
              {f.label} (${f.amount})
            </option>
          ))}
        </select>

        <select
          name="technicianId"
          value={form.technicianId}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Technician</option>
          {technicians.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
