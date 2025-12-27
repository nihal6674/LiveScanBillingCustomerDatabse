import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Technicians() {
  const [techs, setTechs] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
    setError("");

    try {
      await api.post("/technicians", { name });
      setName("");
      loadTechs();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    try {
      await api.put(`/technicians/${id}`, { name: editingName });
      setEditingId(null);
      setEditingName("");
      loadTechs();
    } catch {
      alert("Update failed");
    }
  };

  const toggleActive = async (id) => {
    await api.patch(`/technicians/${id}/active`);
    loadTechs();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Technicians</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Create */}
      <form
        onSubmit={createTech}
        className="bg-white p-4 rounded shadow mb-6 space-y-2"
      >
        <input
          placeholder="Technician Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Technician
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {techs.map((t) => (
            <tr key={t._id}>
              <td className="p-2 border">
                {editingId === t._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  t.name
                )}
              </td>

              <td className="p-2 border">
                {t.active ? "Yes" : "No"}
              </td>

              <td className="p-2 border space-x-2">
                {editingId === t._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(t._id)}
                      className="text-green-600 underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="text-gray-600 underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(t._id);
                      setEditingName(t.name);
                    }}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => toggleActive(t._id)}
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
