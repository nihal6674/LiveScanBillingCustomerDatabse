import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);

      // ✅ Redirect to reset page with email
      navigate("/reset-password", {
        state: { email },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border px-10 py-12 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Forgot Password
        </h1>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Registered Email
        </label>

        <div className="relative mb-6">
          <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 rounded-lg
              border border-gray-300
              bg-gray-50
              focus:bg-white
              focus:ring-2 focus:ring-blue-500
              outline-none
            "
            placeholder="you@company.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-12 rounded-lg
            bg-blue-600 text-white font-semibold
            hover:bg-blue-700
            disabled:opacity-50
            transition
          "
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
}
