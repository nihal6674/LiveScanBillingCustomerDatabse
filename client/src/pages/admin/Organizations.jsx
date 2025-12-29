import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  Building2,
  Pencil,
  Save,
  X,
  Power,
  Ban,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const loadOrgs = () => {
    api.get("/organizations").then((res) => setOrgs(res.data));
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  /* ---------- CREATE ---------- */
  const createOrg = async (e) => {
    e.preventDefault();
    if (loadingAction) return;

    setLoadingAction("create");
    setError("");

    try {
      await api.post("/organizations", { name });
      toast.success("Organization created successfully"); // ✅ SUCCESS
      setName("");
      loadOrgs();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
      toast.error(msg); // ❌ FAILURE

    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    if (loadingAction) return;

    setLoadingAction(`save-${id}`);
    try {
      await api.put(`/organizations/${id}`, {
        name: editingName,
      });
      toast.success("Organization updated"); // ✅

      setEditingId(null);
      setEditingName("");
      loadOrgs();
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
    await api.patch(`/organizations/${id}/active`);

    toast.success("Organization status updated"); // ✅

    loadOrgs();
  } catch {
    toast.error("Failed to update status"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  /* ---------- SUSPEND / UNSUSPEND ---------- */
  const changeSuspend = async (id) => {
  if (loadingAction) return;

  setLoadingAction(`suspend-${id}`);
  try {
    await api.patch(`/organizations/${id}/suspend`);

    toast.success("Suspension status updated"); // ✅

    loadOrgs();
  } catch {
    toast.error("Failed to update suspension"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Organizations
        </h1>
        <p className="text-gray-500 mt-1">
          Manage organizations, status, and access
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      {/* CREATE */}
      <form
        onSubmit={createOrg}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-lg space-y-4"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Building2 size={18} />
          Create Organization
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Organization name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

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
              Add Organization
            </>
          )}
        </button>
      </form>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Organization</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Suspension</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orgs.map((o) => {
              const isEditing = editingId === o._id;

              return (
                <tr
                  key={o._id}
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
                        <Building2 size={16} className="text-gray-400" />
                        {o.name}
                      </div>
                    )}
                  </td>

                  {/* ACTIVE */}
                  <td className="px-4 py-3">
                    {o.active ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>

                  {/* SUSPENDED */}
                  <td className="px-4 py-3">
                    {o.suspended ? (
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                        <Ban size={14} /> Suspended
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 space-x-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(o._id)}
                          disabled={loadingAction === `save-${o._id}`}
                          className="inline-flex items-center gap-1 text-green-600 font-semibold"
                        >
                          {loadingAction === `save-${o._id}` ? (
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
                          setEditingId(o._id);
                          setEditingName(o.name);
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    )}

                    <button
                      onClick={() => changeActive(o._id)}
                      disabled={loadingAction === `active-${o._id}`}
                      className={`inline-flex items-center gap-1 font-semibold ${
                        o.active
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      <Power size={14} />
                      {o.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => changeSuspend(o._id)}
                      disabled={loadingAction === `suspend-${o._id}`}
                      className={`inline-flex items-center gap-1 font-semibold ${
                        o.suspended
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <Ban size={14} />
                      {o.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE (FIXED) ================= */}
      <div className="md:hidden space-y-4">
        {orgs.map((o) => {
          const isEditing = editingId === o._id;

          return (
            <div
              key={o._id}
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
                  {o.name}
                </div>
              )}

              {/* STATUS */}
              <div className="flex gap-3 text-sm">
                {o.active && (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle size={14} /> Active
                  </span>
                )}
                {o.suspended && (
                  <span className="flex items-center gap-1 text-red-600 font-semibold">
                    <Ban size={14} /> Suspended
                  </span>
                )}
              </div>

              {/* PRIMARY */}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(o._id)}
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
                    setEditingId(o._id);
                    setEditingName(o.name);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2"
                >
                  <Pencil size={16} /> Edit
                </button>
              )}

              {/* SECONDARY */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => changeActive(o._id)}
                  className={`py-2 rounded-lg flex justify-center gap-2 ${
                    o.active
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <Power size={16} />
                  {o.active ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => changeSuspend(o._id)}
                  className={`py-2 rounded-lg flex justify-center gap-2 ${
                    o.suspended
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <Ban size={16} />
                  {o.suspended ? "Unsuspend" : "Suspend"}
                </button>
              </div>
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
