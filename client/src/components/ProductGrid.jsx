import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

const ProductGrid = () => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  if (loading) return null; // Or a skeleton

  // Show only a few products or all? Original code mapped all.
  const featuredProducts = products.slice(0, 4); // Usually a grid shows a subset on home

  return (
    <section className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
      <div className="flex items-center justify-center mb-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic mb-2">
            Essential <span className="text-brand-red">Gear</span>
          </h2>
          <div className="w-24 h-1 bg-brand-red mx-auto"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-gradient-to-b from-surface-dark to-black border border-white/5 hover:border-brand-red/50 transition-all duration-300 rounded overflow-hidden flex flex-col shadow-lg hover:shadow-brand-red/20 hover:-translate-y-1"
          >
            <Link
              to={`/product/${product.id}`}
              className="relative aspect-square overflow-hidden block"
            >
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={product.image_url}
              />
              {product.tag && (
                <div className="absolute top-4 left-4 bg-brand-red text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase italic">
                  {product.tag}
                </div>
              )}
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <Link
                to={`/product/${product.id}`}
                className="text-sm font-black uppercase italic mb-1 group-hover:text-brand-red transition-colors"
              >
                {product.name}
              </Link>
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-[10px] text-brand-red">
                  star
                </span>
                <span className="text-[10px] text-zinc-500 font-bold">
                  {product.rating || "New"}
                </span>
              </div>
              <p className="text-xl font-black italic text-brand-red mb-4">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <button
                onClick={() =>
                  addToCart({ ...product, image: product.image_url })
                }
                className="w-full mt-auto bg-white/5 hover:bg-brand-red text-white font-black uppercase italic py-3 text-xs tracking-widest transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
