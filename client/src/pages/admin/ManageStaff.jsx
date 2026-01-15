import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Plus, Lock, Unlock, Key } from "lucide-react";
import CreateStaffModal from "./CreateStaffModal";
import ResetPasswordModal from "./ResetPasswordModal";
import EditStaffModal from "./EditStaffModal";
export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/staff");
      setStaff(res.data);
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/staff/${id}/status`);
      toast.success("Status updated");
      loadStaff();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Staff</h1>
          <p className="text-gray-500">
            Create, activate, deactivate, and reset staff accounts
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-400">
                  Loading staff…
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-400">
                  No staff found
                </td>
              </tr>
            ) : (
              staff.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => toggleStatus(u._id)}
                      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline"
                    >
                      {u.active ? <Lock size={14} /> : <Unlock size={14} />}
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => setEditUser(u)}
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setResetUser(u)}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Key size={14} />
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <CreateStaffModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={loadStaff}
      />
      <EditStaffModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSuccess={loadStaff}
      />

      <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />
    </div>
  );
}
