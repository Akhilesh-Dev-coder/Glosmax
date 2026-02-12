import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // To access token if needed, or AuthContext handles axios interceptors?
  // We'll assume we need to pass token or setup axios with interceptor.
  // For simplicity, let's use fetch with the token from localStorage if AuthContext doesn't expose axios.
  // Checking AuthContext.jsx earlier (step 140), it didn't seem to have a global axios instance.
  // We'll fetch directly.

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        alert("Failed to delete user: " + data.error);
      }
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const handleRoleUpdate = async (userId, isAdmin) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/auth/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }), // Toggle
      });
      const data = await res.json();
      if (data.success) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, admin: !isAdmin ? 1 : 0 } : u,
          ),
        );
      } else {
        alert("Failed to update role: " + data.error);
      }
    } catch (err) {
      alert("Error updating role");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading users...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <span className="material-symbols-outlined text-sm">group</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Management
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            User{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-white">
              List
            </span>
          </h1>
        </div>
      </div>

      <div className="bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
              <tr>
                <th className="pb-4 pl-4">User ID</th>
                <th className="pb-4">Full Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 pl-4 font-mono text-white/50">{u.id}</td>
                  <td className="py-4 font-bold text-white">{u.full_name}</td>
                  <td className="py-4 text-white/60">{u.email}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        u.admin
                          ? "text-brand-red bg-brand-red/10 border-brand-red/20"
                          : "text-slate-500 bg-slate-500/10 border-slate-500/20"
                      }`}
                    >
                      {u.admin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleRoleUpdate(u.id, u.admin)}
                      className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors text-white/40"
                    >
                      {u.admin ? "Demote" : "Promote"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-8 text-center text-white/40">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
