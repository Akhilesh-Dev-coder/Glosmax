import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || !isHome || mobileMenuOpen
            ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/5"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative z-50">
            <img
              src={logo}
              alt="Glosmax"
              className="h-8 md:h-10 object-contain hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 bg-surface-dark/50 backdrop-blur-sm px-8 py-3 rounded-full border border-white/5">
            <Link
              to="/"
              className="text-white text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-red transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-red transition-colors"
            >
              About
            </Link>
            <Link
              to="/shop"
              className="text-white text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-red transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="text-white text-xs font-bold uppercase tracking-[0.1em] hover:text-brand-red transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 relative z-50">
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>

            {user?.admin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all shadow-lg shadow-brand-red/20"
              >
                <span className="material-symbols-outlined text-sm">
                  admin_panel_settings
                </span>
                Admin Panel
              </Link>
            )}

            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="hidden md:flex items-center gap-2 text-white hover:text-brand-red transition-colors group"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                person
              </span>
              <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">
                {isAuthenticated
                  ? user?.fullName?.split(" ")[0] || "Account"
                  : "Login"}
              </span>
            </Link>

            <Link
              to="/cart"
              className="relative group text-white hover:text-brand-red transition-colors"
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-brand-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-brand-red/50">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white z-50 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-3xl transition-transform duration-300 transform">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer - Simple & Professional */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-zinc-950 border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
            <span className="text-sm font-bold uppercase tracking-widest text-white/50">
              Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                ...(user?.admin
                  ? [{ name: "Admin Panel", path: "/admin" }]
                  : []),
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 group border-b border-white/5 text-white hover:pl-2 transition-all"
                >
                  <span className="text-xl font-bold uppercase tracking-wider">
                    {item.name}
                  </span>
                  <span className="material-symbols-outlined text-white/20 group-hover:text-brand-red transition-colors text-lg">
                    chevron_right
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 space-y-4">
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-dark border border-white/5 hover:border-brand-red/30 transition-colors"
            >
              <span className="material-symbols-outlined text-brand-red">
                person
              </span>
              <div className="flex-1">
                <span className="block text-sm font-bold text-white uppercase tracking-wider">
                  {isAuthenticated ? "My Account" : "Login / Register"}
                </span>
                {isAuthenticated && (
                  <span className="text-xs text-white/40">
                    Manage your profile
                  </span>
                )}
              </div>
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-dark border border-white/5 hover:border-brand-red/30 transition-colors"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-brand-red">
                  shopping_cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 flex justify-between items-center">
                <span className="block text-sm font-bold text-white uppercase tracking-wider">
                  View Cart
                </span>
                {cartCount > 0 && (
                  <span className="text-xs font-bold bg-white/10 text-white px-2 py-1 rounded">
                    {cartCount} Items
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
              Glosmax Detailing
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
