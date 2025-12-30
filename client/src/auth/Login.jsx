import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import logo from "../assets/logo.png";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-10 py-12"
        >
          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <img
              src={logo}
              alt="Live Scan Billing"
              className="h-20 w-auto object-contain mb-6"
            />
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Live Scan Billing
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="
                  w-full pl-11 pr-4 py-3 rounded-lg
                  border border-gray-300
                  bg-gray-50
                  focus:bg-white
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="
                  w-full pl-11 pr-4 py-3 rounded-lg
                  border border-gray-300
                  bg-gray-50
                  focus:bg-white
                  focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  outline-none
                  transition
                "
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-12 rounded-lg
              bg-blue-600 text-white font-semibold
              hover:bg-blue-700
              active:scale-[0.99]
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50
              transition-all
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
          © {new Date().getFullYear()} Live Scan Billing. All rights reserved.
        </p>
      </div>
    </div>
  );
}
