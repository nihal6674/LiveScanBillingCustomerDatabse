import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  Briefcase,
  Pencil,
  Save,
  X,
  Power,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [qboItemName, setQboItemName] = useState("");
  const [rate, setRate] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingQbo, setEditingQbo] = useState("");
  const [editingRate, setEditingRate] = useState("");

  const loadServices = () => {
    api.get("/services").then((res) => setServices(res.data));
  };

  useEffect(() => {
    loadServices();
  }, []);

  /* ---------- CREATE ---------- */
  const createService = async (e) => {
  e.preventDefault();
  if (loadingAction) return;

  setLoadingAction("create");

  try {
    await api.post("/services/create", {
      name,
      qboItemName,
      rate: Number(rate),
    });

    toast.success("Service created successfully"); // ✅

    setName("");
    setQboItemName("");
    setRate("");
    loadServices();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to create service"
    ); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
  if (loadingAction) return;

  setLoadingAction(`save-${id}`);

  try {
    await api.put(`/services/${id}`, {
      name: editingName,
      qboItemName: editingQbo,
      rate: Number(editingRate),
    });

    toast.success("Service updated"); // ✅

    setEditingId(null);
    loadServices();
  } catch {
    toast.error("Update failed"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  /* ---------- ACTIVATE / DEACTIVATE ---------- */
  const changeActive = async (id) => {
  if (loadingAction) return;

  setLoadingAction(`active-${id}`);

  try {
    await api.patch(`/services/${id}/active`);

    toast.success("Service status updated"); // ✅

    loadServices();
  } catch {
    toast.error("Failed to update status"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Services
        </h1>
        <p className="text-gray-500 mt-1">
          Manage services, billing rates, and QBO mapping
        </p>
      </div>

      {/* CREATE SERVICE */}
      <form
        onSubmit={createService}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-lg space-y-4"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Briefcase size={18} />
          Create Service
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service Name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <input
          value={qboItemName}
          onChange={(e) => setQboItemName(e.target.value)}
          placeholder="QBO Item Name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <div className="relative">
          <DollarSign
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Rate"
            className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          disabled={loadingAction === "create"}
          className="w-full flex items-center justify-center gap-2
                     bg-blue-600 text-white font-semibold
                     py-3 rounded-lg
                     hover:bg-blue-700
                     disabled:opacity-50 transition"
        >
          {loadingAction === "create" ? (
            <ButtonLoader text="Adding…" />
          ) : (
            <>
              <Plus size={16} />
              Add Service
            </>
          )}
        </button>
      </form>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Service</th>
              <th className="px-4 py-3 text-left">QBO Item</th>
              <th className="px-4 py-3 text-left">Rate</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {services.map((s) => {
              const isEditing = editingId === s._id;

              return (
                <tr
                  key={s._id}
                  className={`transition ${
                    isEditing ? "bg-blue-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  {/* NAME */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editingName}
                        onChange={(e) =>
                          setEditingName(e.target.value)
                        }
                        className="w-full border-2 border-blue-400 bg-blue-50 rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2 font-medium">
                        <Briefcase
                          size={16}
                          className="text-gray-400"
                        />
                        {s.name}
                      </div>
                    )}
                  </td>

                  {/* QBO */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editingQbo}
                        onChange={(e) =>
                          setEditingQbo(e.target.value)
                        }
                        className="w-full border-2 border-blue-400 bg-blue-50 rounded px-2 py-1"
                      />
                    ) : (
                      s.qboItemName
                    )}
                  </td>

                  {/* RATE */}
                  <td className="px-4 py-3 font-semibold">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editingRate}
                        onChange={(e) =>
                          setEditingRate(e.target.value)
                        }
                        className="w-28 border-2 border-blue-400 bg-blue-50 rounded px-2 py-1"
                      />
                    ) : (
                      `$${s.rate.toFixed(2)}`
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    {s.active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 space-x-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(s._id)}
                          disabled={loadingAction === `save-${s._id}`}
                          className="inline-flex items-center gap-1 text-green-600 font-semibold"
                        >
                          {loadingAction === `save-${s._id}` ? (
                            <ButtonLoader small />
                          ) : (
                            <Save size={14} />
                          )}
                          Save
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 text-gray-600"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(s._id);
                          setEditingName(s.name);
                          setEditingQbo(s.qboItemName);
                          setEditingRate(s.rate);
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    )}

                    <button
                      onClick={() => changeActive(s._id)}
                      disabled={loadingAction === `active-${s._id}`}
                      className={`inline-flex items-center gap-1 font-semibold ${
                        s.active
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      <Power size={14} />
                      {s.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden space-y-4">
        {services.map((s) => {
          const isEditing = editingId === s._id;

          return (
            <div
              key={s._id}
              className={`bg-white rounded-xl shadow border p-4 space-y-4 ${
                isEditing ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {/* NAME */}
              {isEditing ? (
                <input
                  value={editingName}
                  onChange={(e) =>
                    setEditingName(e.target.value)
                  }
                  className="w-full border-2 border-blue-400 bg-blue-50 rounded px-3 py-2"
                />
              ) : (
                <div className="font-semibold text-gray-800">
                  {s.name}
                </div>
              )}

              {/* QBO */}
              {isEditing ? (
                <input
                  value={editingQbo}
                  onChange={(e) =>
                    setEditingQbo(e.target.value)
                  }
                  className="w-full border-2 border-blue-400 bg-blue-50 rounded px-3 py-2"
                />
              ) : (
                <div className="text-gray-600 text-sm">
                  QBO: {s.qboItemName}
                </div>
              )}

              {/* RATE */}
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editingRate}
                  onChange={(e) =>
                    setEditingRate(e.target.value)
                  }
                  className="w-full border-2 border-blue-400 bg-blue-50 rounded px-3 py-2"
                />
              ) : (
                <div className="text-gray-600 font-semibold">
                  ${s.rate.toFixed(2)}
                </div>
              )}

              {/* STATUS */}
              <div className="flex gap-2 text-sm">
                {s.active ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle size={14} /> Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <XCircle size={14} /> Inactive
                  </span>
                )}
              </div>

              {/* PRIMARY */}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(s._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-200 py-2 rounded-lg flex justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(s._id);
                    setEditingName(s.name);
                    setEditingQbo(s.qboItemName);
                    setEditingRate(s.rate);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2"
                >
                  <Pencil size={16} /> Edit
                </button>
              )}

              {/* SECONDARY */}
              <button
                onClick={() => changeActive(s._id)}
                className={`w-full py-2 rounded-lg flex justify-center gap-2 ${
                  s.active
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <Power size={16} />
                {s.active ? "Deactivate" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- BUTTON LOADER ---------- */
function ButtonLoader({ text, small }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${
          small ? "w-3 h-3" : "w-5 h-5"
        } border-2 border-current border-t-transparent rounded-full animate-spin`}
      />
      {!small && text && <span>{text}</span>}
    </div>
  );
}
