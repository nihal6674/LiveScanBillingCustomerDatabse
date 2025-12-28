import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === "ADMIN" ? "/admin" : "/staff");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-10"
        >
          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Live Scan Billing
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="
                  w-full pl-9 pr-3 py-2.5 rounded-lg
                  border border-gray-300
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition
                "
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="
                  w-full pl-9 pr-3 py-2.5 rounded-lg
                  border border-gray-300
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition
                "
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-11 rounded-lg
              bg-blue-600 text-white font-semibold
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50
              transition
              flex items-center justify-center
            "
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Live Scan Billing
        </p>
      </div>
    </div>
  );
}
