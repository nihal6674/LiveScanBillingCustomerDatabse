import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import Input from "../../components/Input";

export default function CreateStaffModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!open) return null;

  const submit = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.post("/admin/staff", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Staff created");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <Modal title="Create Staff" onClose={onClose}>
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

      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Input
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      <button
        onClick={submit}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create Staff
      </button>
    </Modal>
  );
}
