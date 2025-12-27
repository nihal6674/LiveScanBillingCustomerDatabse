import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Organizations() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

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
    setError("");

    try {
      await api.post("/organizations", { name });
      setName("");
      loadOrgs();
    } catch (err) {
      setError(err.response?.data?.message || "Create failed");
    }
  };

  /* ---------- UPDATE ---------- */
  const saveEdit = async (id) => {
    try {
      await api.put(`/organizations/${id}`, {
        name: editingName,
      });
      setEditingId(null);
      setEditingName("");
      loadOrgs();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const toggleSuspend = async (id) => {
    await api.patch(`/organizations/${id}/suspend`);
    loadOrgs();
  };

  const toggleActive = async (id) => {
    await api.patch(`/organizations/${id}/active`);
    loadOrgs();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Organizations</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Create */}
      <form
        onSubmit={createOrg}
        className="bg-white p-4 rounded shadow mb-6 space-y-2"
      >
        <input
          placeholder="Organization Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Organization
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Suspended</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orgs.map((o) => (
            <tr key={o._id}>
              {/* NAME */}
              <td className="p-2 border">
                {editingId === o._id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border p-1 w-full"
                  />
                ) : (
                  o.name
                )}
              </td>

              <td className="p-2 border">
                {o.active ? "Yes" : "No"}
              </td>

              <td className="p-2 border">
                {o.suspended ? "Yes" : "No"}
              </td>

              <td className="p-2 border space-x-2">
                {/* EDIT */}
                {editingId === o._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(o._id)}
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
                      setEditingId(o._id);
                      setEditingName(o.name);
                    }}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </button>
                )}

                {/* TOGGLES */}
                <button
                  onClick={() => toggleActive(o._id)}
                  className="text-blue-600 underline"
                >
                  Toggle Active
                </button>
                <button
                  onClick={() => toggleSuspend(o._id)}
                  className="text-red-600 underline"
                >
                  Toggle Suspend
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
