import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.type === "text" && e.target.placeholder.includes("First")
        ? "firstName"
        : e.target.type === "text" && e.target.placeholder.includes("Last")
          ? "lastName"
          : e.target.type === "email"
            ? "email"
            : e.target.placeholder.includes("Confirm")
              ? "confirmPassword"
              : "password"]: e.target.value,
    });
  };
  // Since original inputs didn't have name attributes, I'll add them to be cleaner
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const result = await register(fullName, formData.email, formData.password);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-background-black">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-red/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-red/5 to-transparent pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl shadow-black/50 relative group hover:border-brand-red/30 transition-all duration-500 hover:shadow-brand-red/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              Join <span className="text-brand-red">Glosmax</span>
            </h2>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              Experience the standard of excellence
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="driver@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60 ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-black uppercase italic tracking-widest py-4 rounded-lg transition-all soft-glow-red"
              >
                Register Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-white hover:text-brand-red font-bold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
