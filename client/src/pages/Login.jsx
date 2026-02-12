import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      if (result.user && result.user.admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-background-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-red/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[128px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl shadow-black/50 relative group hover:border-brand-red/30 transition-all duration-500 hover:shadow-brand-red/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              Welcome <span className="text-brand-red">Back</span>
            </h2>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              Sign in to access your garage
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-brand-red hover:text-white transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-black uppercase italic tracking-widest py-4 rounded-lg transition-all soft-glow-red mt-4"
            >
              Ignition
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white hover:text-brand-red font-bold transition-colors"
              >
                Join the Club
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
