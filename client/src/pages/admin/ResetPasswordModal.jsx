import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import Input from "../../components/Input";

export default function ResetPasswordModal({ user, onClose }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  if (!user) return null;

  const submit = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await api.patch(
        `/admin/staff/${user._id}/password`,
        { password: form.password }
      );

      toast.success("Password updated");
      onClose();
    } catch {
      toast.error("Failed to update password");
    }
  };

  return (
    <Modal
      title={`Reset Password (${user.email})`}
      onClose={onClose}
    >
      <Input
        label="New Password"
        type="password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <Input
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={(e) =>
          setForm({
            ...form,
            confirmPassword: e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Update Password
      </button>
    </Modal>
  );
}
