import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  User,
  Pencil,
  Save,
  X,
  Power,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Technicians() {
  const [techs, setTechs] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const loadTechs = () => {
    api.get("/technicians").then((res) => setTechs(res.data));
  };

  useEffect(() => {
    loadTechs();
  }, []);

  /* ---------- CREATE ---------- */
  const createTech = async (e) => {
    e.preventDefault();
    if (loadingAction) return;

    setLoadingAction("create");
    setError("");

    try {
      await api.post("/technicians", { name });
      setName("");
      loadTechs();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    if (loadingAction) return;

    setLoadingAction(`save-${id}`);
    try {
      await api.put(`/technicians/${id}`, {
        name: editingName,
      });
      setEditingId(null);
      setEditingName("");
      loadTechs();
    } catch {
      alert("Update failed");
    } finally {
      setLoadingAction(null);
    }
  };

  /* ---------- ACTIVATE / DEACTIVATE ---------- */
  const changeActive = async (id) => {
    if (loadingAction) return;

    setLoadingAction(`active-${id}`);
    await api.patch(`/technicians/${id}/active`);
    loadTechs();
    setLoadingAction(null);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Technicians
        </h1>
        <p className="text-gray-500 mt-1">
          Manage technician accounts and availability
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      {/* CREATE TECHNICIAN */}
      <form
        onSubmit={createTech}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-lg space-y-4"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <User size={18} />
          Add Technician
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Technician Name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <button
          type="submit"
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
              Add Technician
            </>
          )}
        </button>
      </form>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Technician</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {techs.map((t) => {
              const isEditing = editingId === t._id;

              return (
                <tr
                  key={t._id}
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
                        <User size={16} className="text-gray-400" />
                        {t.name}
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    {t.active ? (
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
                          onClick={() => saveEdit(t._id)}
                          disabled={loadingAction === `save-${t._id}`}
                          className="inline-flex items-center gap-1 text-green-600 font-semibold"
                        >
                          {loadingAction === `save-${t._id}` ? (
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
                          setEditingId(t._id);
                          setEditingName(t.name);
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    )}

                    <button
                      onClick={() => changeActive(t._id)}
                      disabled={loadingAction === `active-${t._id}`}
                      className={`inline-flex items-center gap-1 font-semibold ${
                        t.active
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      <Power size={14} />
                      {t.active ? "Deactivate" : "Activate"}
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
        {techs.map((t) => {
          const isEditing = editingId === t._id;

          return (
            <div
              key={t._id}
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
                  {t.name}
                </div>
              )}

              {/* STATUS */}
              <div className="flex gap-2 text-sm">
                {t.active ? (
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
                    onClick={() => saveEdit(t._id)}
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
                    setEditingId(t._id);
                    setEditingName(t.name);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2"
                >
                  <Pencil size={16} /> Edit
                </button>
              )}

              {/* SECONDARY */}
              <button
                onClick={() => changeActive(t._id)}
                className={`w-full py-2 rounded-lg flex justify-center gap-2 ${
                  t.active
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <Power size={16} />
                {t.active ? "Deactivate" : "Activate"}
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
