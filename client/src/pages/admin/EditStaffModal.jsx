import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import Input from "../../components/Input";

export default function EditStaffModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  if (!user) return null;

  const submit = async () => {
    try {
      await api.patch(`/admin/staff/${user._id}`, form);
      toast.success("Staff updated");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Modal title="Edit Staff" onClose={onClose}>
      <Input
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <button
        onClick={submit}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Save Changes
      </button>
    </Modal>
  );
}
