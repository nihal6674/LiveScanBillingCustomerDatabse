import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [qboItemName, setQboItemName] = useState("");
  const [rate, setRate] = useState("");

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
    await api.post("/services/create", {
      name,
      qboItemName,
      rate: Number(rate),
    });
    setName("");
    setQboItemName("");
    setRate("");
    loadServices();
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    await api.put(`/services/${id}`, {
      name: editingName,
      qboItemName: editingQbo,
      rate: Number(editingRate),
    });
    setEditingId(null);
    loadServices();
  };

  const toggleActive = async (id) => {
    await api.patch(`/services/${id}/active`);
    loadServices();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      {/* Create */}
      <form
        onSubmit={createService}
        className="bg-white p-4 rounded shadow mb-6 space-y-2"
      >
        <input
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          placeholder="QBO Item Name"
          value={qboItemName}
          onChange={(e) => setQboItemName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Service
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">QBO Item</th>
            <th className="p-2 border">Rate</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s._id}>
              <td className="p-2 border">
                {editingId === s._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  s.name
                )}
              </td>

              <td className="p-2 border">
                {editingId === s._id ? (
                  <input
                    value={editingQbo}
                    onChange={(e) => setEditingQbo(e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  s.qboItemName
                )}
              </td>

              <td className="p-2 border">
                {editingId === s._id ? (
                  <input
                    type="number"
                    value={editingRate}
                    onChange={(e) => setEditingRate(e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  `$${s.rate}`
                )}
              </td>

              <td className="p-2 border">
                {s.active ? "Yes" : "No"}
              </td>

              <td className="p-2 border space-x-2">
                {editingId === s._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(s._id)}
                      className="text-green-600 underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 underline"
                    >
                      Cancel
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
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => toggleActive(s._id)}
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
