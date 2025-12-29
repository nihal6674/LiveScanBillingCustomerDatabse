import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Pencil,
  Save,
  X,
  Power,
} from "lucide-react";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingAmount, setEditingAmount] = useState("");

  const loadFees = () => {
    api.get("/fees").then((res) => setFees(res.data));
  };

  useEffect(() => {
    loadFees();
  }, []);

  /* ---------- CREATE ---------- */
  const createFee = async (e) => {
  e.preventDefault();
  if (loadingAction) return;

  setLoadingAction("create");

  try {
    await api.post("/fees", {
      label,
      amount: Number(amount),
    });

    toast.success("Fee created successfully"); // ✅

    setLabel("");
    setAmount("");
    loadFees();
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to create fee"
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
    await api.put(`/fees/${id}`, {
      label: editingLabel,
      amount: Number(editingAmount),
    });

    toast.success("Fee updated"); // ✅

    setEditingId(null);
    setEditingLabel("");
    setEditingAmount("");
    loadFees();
  } catch {
    toast.error("Update failed"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  /* ---------- ACTIVATE / DEACTIVATE ---------- */
  const changeStatus = async (id) => {
  if (loadingAction) return;

  setLoadingAction(`status-${id}`);

  try {
    await api.patch(`/fees/${id}/active`);

    toast.success("Fee status updated"); // ✅

    loadFees();
  } catch {
    toast.error("Failed to update status"); // ❌
  } finally {
    setLoadingAction(null);
  }
};


  return (
    <div className="space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-800">
        DOJ / FBI Fees
      </h1>

      {/* CREATE */}
      <form
        onSubmit={createFee}
        className="bg-white rounded-2xl shadow p-6 max-w-lg space-y-4"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Tag size={18} />
          Create New Fee
        </div>

        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="DOJ – Standard"
          className="w-full border rounded-lg px-3 py-2"
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-9 border rounded-lg px-3 py-2"
            required
          />
        </div>

        <button
          disabled={loadingAction === "create"}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
        >
          {loadingAction === "create" ? (
            <ButtonLoader />
          ) : (
            <>
              <Save size={16} />
              Add Fee
            </>
          )}
        </button>
      </form>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Label</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((f) => {
              const isEditing = editingId === f._id;

              return (
                <tr
                  key={f._id}
                  className={`border-t ${
                    isEditing ? "bg-blue-50" : ""
                  }`}
                >
                  {/* LABEL */}
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        value={editingLabel}
                        onChange={(e) =>
                          setEditingLabel(e.target.value)
                        }
                        className="border-2 border-blue-400 bg-blue-50 rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      f.label
                    )}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editingAmount}
                        onChange={(e) =>
                          setEditingAmount(e.target.value)
                        }
                        className="border-2 border-blue-400 bg-blue-50 rounded px-2 py-1"
                      />
                    ) : (
                      `$${f.amount.toFixed(2)}`
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    {f.active ? (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(f._id)}
                          className="flex items-center gap-1 text-green-600 font-semibold"
                        >
                          <Save size={14} />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 text-gray-600"
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(f._id);
                          setEditingLabel(f.label);
                          setEditingAmount(f.amount);
                        }}
                        className="flex items-center gap-1 text-blue-600 font-semibold"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => changeStatus(f._id)}
                      className={`flex items-center gap-1 font-semibold ${
                        f.active
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      <Power size={14} />
                      {f.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {fees.map((f) => {
          const isEditing = editingId === f._id;

          return (
            <div
              key={f._id}
              className={`bg-white rounded-xl shadow p-4 space-y-3 ${
                isEditing ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {isEditing ? (
                <>
                  <input
                    value={editingLabel}
                    onChange={(e) =>
                      setEditingLabel(e.target.value)
                    }
                    className="border-2 border-blue-400 bg-blue-50 rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    value={editingAmount}
                    onChange={(e) =>
                      setEditingAmount(e.target.value)
                    }
                    className="border-2 border-blue-400 bg-blue-50 rounded px-3 py-2"
                  />
                </>
              ) : (
                <>
                  <div className="font-semibold">
                    {f.label}
                  </div>
                  <div className="text-gray-600">
                    ${f.amount.toFixed(2)}
                  </div>
                </>
              )}

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(f._id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-200 py-2 rounded-lg flex justify-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(f._id);
                      setEditingLabel(f.label);
                      setEditingAmount(f.amount);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => changeStatus(f._id)}
                  className={`flex-1 py-2 rounded-lg flex justify-center gap-2 ${
                    f.active
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <Power size={16} />
                  {f.active ? "Deactivate" : "Activate"}
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
function ButtonLoader() {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}
