import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingAmount, setEditingAmount] = useState("");

  const loadFees = () => {
    api
      .get("/fees")
      .then((res) => setFees(res.data))
      .catch(() => setError("Failed to load fees"));
  };

  useEffect(() => {
    loadFees();
  }, []);

  /* ---------- CREATE ---------- */
  const createFee = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/fees", {
        label,
        amount: Number(amount),
      });
      setLabel("");
      setAmount("");
      loadFees();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    try {
      await api.put(`/fees/${id}`, {
        label: editingLabel,
        amount: Number(editingAmount),
      });
      setEditingId(null);
      setEditingLabel("");
      setEditingAmount("");
      loadFees();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const toggleActive = async (id) => {
    await api.patch(`/fees/${id}/active`);
    loadFees();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        DOJ / FBI Fees
      </h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Create Fee */}
      <form
        onSubmit={createFee}
        className="bg-white p-4 rounded shadow mb-6 space-y-2"
      >
        <input
          placeholder="Fee Label (e.g. DOJ – Standard)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Fee
        </button>
      </form>

      {/* Fee Table */}
      <table className="w-full bg-white border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Label</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((f) => (
            <tr key={f._id}>
              {/* LABEL */}
              <td className="p-2 border">
                {editingId === f._id ? (
                  <input
                    value={editingLabel}
                    onChange={(e) =>
                      setEditingLabel(e.target.value)
                    }
                    className="border p-1 w-full"
                  />
                ) : (
                  f.label
                )}
              </td>

              {/* AMOUNT */}
              <td className="p-2 border">
                {editingId === f._id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editingAmount}
                    onChange={(e) =>
                      setEditingAmount(e.target.value)
                    }
                    className="border p-1 w-full"
                  />
                ) : (
                  `$${f.amount.toFixed(2)}`
                )}
              </td>

              <td className="p-2 border">
                {f.active ? "Yes" : "No"}
              </td>

              <td className="p-2 border space-x-2">
                {/* EDIT */}
                {editingId === f._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(f._id)}
                      className="text-green-600 underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingLabel("");
                        setEditingAmount("");
                      }}
                      className="text-gray-600 underline"
                    >
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
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                )}

                {/* TOGGLE */}
                <button
                  onClick={() => toggleActive(f._id)}
                  className="text-red-600 underline"
                >
                  Toggle Active
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
