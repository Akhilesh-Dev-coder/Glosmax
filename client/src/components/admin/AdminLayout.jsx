import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "dashboard" },
    { name: "Products", path: "/admin/products", icon: "inventory_2" },
    { name: "Orders", path: "/admin/orders", icon: "shopping_cart" },
    { name: "Users", path: "/admin/users", icon: "group" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-display flex relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-red/5 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none"></div>

      {/* Sidebar - Desktop (Floating Glass) */}
      <aside className="hidden md:flex fixed top-4 bottom-4 left-4 w-72 flex-col bg-surface-dark/60 backdrop-blur-2xl border border-white/5 rounded-2xl z-50 shadow-2xl shadow-black/50">
        <div className="p-8 flex items-center justify-center border-b border-white/5">
          <Link to="/admin">
            <img
              src={logo}
              alt="Glosmax Admin"
              className="h-10 object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20 translate-x-2"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                >
                  {item.icon}
                </span>
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">logout</span>
            Exit Panel
          </Link>
        </div>
      </aside>

      {/* Mobile Header (Sleek) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <img src={logo} alt="Glosmax" className="h-6 object-contain" />
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-white bg-surface-dark border border-white/10 rounded-lg active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Mobile Drawer (Slide-in) */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ${
          sidebarOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-500 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div
          className={`absolute top-0 bottom-0 left-0 w-[85%] max-w-sm bg-surface-dark border-r border-white/10 shadow-2xl shadow-black transition-transform duration-500 ease-out flex flex-col ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-black uppercase tracking-widest text-white/50">
              Admin Menu
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-white bg-white/5 rounded-full"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-3">
            {navItems.map((item, idx) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-4 py-4 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
            >
              <span className="material-symbols-outlined">logout</span>
              Exit Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen md:pl-[320px] p-6 md:p-8 pt-24 md:pt-8 bg-black overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
