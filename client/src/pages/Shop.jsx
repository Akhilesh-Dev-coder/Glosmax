import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const Shop = () => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "All",
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const categories = [
    { name: "All Products", id: "All", icon: "grid_view" },
    { name: "Exterior Care", id: "Exterior Care", icon: "directions_car" },
    { name: "Interior Care", id: "Interior Care", icon: "event_seat" },
    { name: "Coatings", id: "Coatings", icon: "verified_user" },
    { name: "Wheels & Tires", id: "Wheels & Tires", icon: "tire_repair" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
            Loading Catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background-black to-background-black">
      {/* Hero Header */}
      <div className="relative h-[30vh] min-h-[250px] md:h-[40vh] flex items-end border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-black via-background-black/80 to-transparent"></div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-6 lg:px-20 pb-8 md:pb-12 w-full flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="w-full md:w-auto">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2 md:mb-4">
              <Link className="hover:text-brand-red transition-colors" to="/">
                Home
              </Link>
              <span className="material-symbols-outlined text-[10px]">
                chevron_right
              </span>
              <span className="text-brand-red">Shop Catalog</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter uppercase italic text-white mb-2 leading-none">
              Professional{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">
                Grade
              </span>
            </h1>
            <p className="text-zinc-400 max-w-lg text-xs md:text-lg">
              Elite detailing products engineered for perfectionists.
            </p>
          </div>
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full flex justify-end">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center gap-2 bg-brand-red/10 border border-brand-red/50 text-brand-red px-4 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-red hover:text-white transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]"
            >
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-20 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Desktop Sidebar (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-8">
            <div className="bg-surface-dark/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/60">
                  Collections
                </h3>
                <span className="material-symbols-outlined text-white/20">
                  category
                </span>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      selectedCategory === cat.id
                        ? "bg-brand-red text-white shadow-lg shadow-brand-red/25"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl relative z-10 ${selectedCategory === cat.id ? "filled-icon" : ""}`}
                    >
                      {cat.icon}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-left flex-1 relative z-10">
                      {cat.name}
                    </span>
                    {selectedCategory === cat.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-red-600 z-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Widget */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-zinc-800 to-black border border-white/5 group cursor-pointer hover:border-brand-red/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 blur-[60px] group-hover:bg-brand-red/30 transition-colors"></div>
              <span className="inline-block px-3 py-1 bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-widest rounded mb-4 border border-brand-red/20">
                New Arrival
              </span>
              <h4 className="text-2xl font-black uppercase italic text-white mb-2">
                Glosmax <br />
                Ceramic Pro
              </h4>
              <p className="text-xs text-zinc-400 mb-6">
                Next-gen protection for your vehicle.
              </p>
              <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                Shop Now{" "}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
            mobileFiltersOpen ? "visible" : "invisible pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${
              mobileFiltersOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileFiltersOpen(false)}
          ></div>

          <div
            className={`absolute right-0 top-0 bottom-0 w-80 bg-surface-dark border-l border-white/10 shadow-2xl shadow-black p-8 transition-transform duration-500 ease-out cubic-bezier(0.22, 1, 0.36, 1) ${
              mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                <span className="text-brand-red">Filter</span> Gear
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl ${selectedCategory === cat.id ? "filled-icon" : ""}`}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-left flex-1">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl">
              <span className="material-symbols-outlined text-6xl text-white/10 mb-6">
                inventory_2
              </span>
              <h3 className="text-xl font-black uppercase italic text-white mb-2">
                No products found
              </h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-6">
                We couldn't find any products in this category at the moment.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="text-brand-red hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 animate-fade-in-up">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-surface-dark/40 backdrop-blur-sm border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden hover:border-brand-red/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-red/10 flex flex-col"
                >
                  {/* Image Container */}
                  <Link
                    to={`/product/${product.id}`}
                    className="relative aspect-[4/5] overflow-hidden block bg-black/50"
                  >
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      src={product.image_url}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>

                    {/* Tags */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1 md:gap-2">
                      {product.tag && (
                        <span className="inline-block bg-brand-red text-white text-[8px] md:text-[10px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-brand-red/20 backdrop-blur-md">
                          {product.tag}
                        </span>
                      )}
                      {product.rating && (
                        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10">
                          <span className="material-symbols-outlined text-[10px] md:text-xs text-yellow-500 filled-icon">
                            star
                          </span>
                          {product.rating}
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button - Appears on Hover */}
                    {!product.stock || product.stock <= 0 ? (
                      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-lg opacity-100">
                        Out of Stock
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({ ...product, image: product.image_url });
                        }}
                        className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-8 h-8 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center transform md:translate-y-20 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-red hover:text-white shadow-xl z-20"
                        title="Add to Cart"
                      >
                        <span className="material-symbols-outlined text-sm md:text-xl">
                          add_shopping_cart
                        </span>
                      </button>
                    )}
                  </Link>

                  {/* Content Info */}
                  <div className="p-3 md:p-6 flex flex-col flex-1 relative">
                    <div className="mb-2 md:mb-4">
                      <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 md:mb-2 line-clamp-1">
                        {product.category}
                      </p>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm md:text-xl font-black uppercase italic leading-tight text-white group-hover:text-brand-red transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-2 md:pt-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">
                          Price
                        </span>
                        <span className="text-sm md:text-xl font-black text-brand-red">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Link
                        to={`/product/${product.id}`}
                        className="hidden md:flex text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors items-center gap-1 group/link"
                      >
                        Details{" "}
                        <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
