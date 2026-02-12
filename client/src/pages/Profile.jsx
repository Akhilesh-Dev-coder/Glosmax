import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-background-black">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden bg-background-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-background-black">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-[128px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="bg-surface-dark/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-white/5 bg-white/5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-brand-red/20 flex items-center justify-center border-2 border-brand-red text-4xl font-black text-brand-red italic">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
                  {user.fullName}
                </h1>
                <p className="text-white/40 font-medium tracking-wide">
                  {user.email}
                </p>
                {user.admin && (
                  <span className="inline-block mt-3 px-3 py-1 bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Admin Access
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                  Account Status
                </label>
                <div className="text-green-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Active
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full bg-white/5 hover:bg-red-500/20 text-white hover:text-red-500 border border-white/10 hover:border-red-500/50 font-bold uppercase tracking-widest py-4 rounded-lg transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
