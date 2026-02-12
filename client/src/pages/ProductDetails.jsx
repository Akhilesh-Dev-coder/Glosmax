import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products, loading, addReview } = useProducts();
  const { user } = useAuth(); // Create access to auth user
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);

  // Checkout State (Moved to top)
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    phoneNumber: "",
    house: "",
    street: "",
    town: "",
    city: "",
    pincode: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Review State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        // Initialize selected image
        const imgs =
          found.images && found.images.length > 0
            ? found.images
            : found.image_url
              ? [found.image_url]
              : [];
        setSelectedImage(imgs[0]);
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-4xl font-black uppercase italic mb-4">
          Product Not Found
        </h2>
        <Link
          to="/shop"
          className="text-brand-red hover:underline uppercase tracking-widest text-sm font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Parse JSON fields safely if they are strings
  const features =
    typeof product.features === "string"
      ? JSON.parse(product.features)
      : product.features || [];
  const specs =
    typeof product.specifications === "string"
      ? JSON.parse(product.specifications)
      : product.specifications || {};
  const reviews =
    typeof product.reviews === "string"
      ? JSON.parse(product.reviews)
      : product.reviews || [];

  const handleAddToCart = () => {
    const cartItem = { ...product, image: product.image_url };
    addToCart(cartItem, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to write a review.");
      return;
    }
    setIsSubmittingReview(true);
    const result = await addReview(product.id, {
      user: user.name || "Customer", // Fallback if name is missing but usually name is present
      rating: reviewRating,
      comment: reviewComment,
    });

    if (result.success) {
      setIsReviewModalOpen(false);
      setReviewRating(5);
      setReviewComment("");
      // Product data will auto-update via context
    } else {
      alert("Failed to add review: " + result.error);
    }
    setIsSubmittingReview(false);
  };

  // Import handlePayment dynamically or assume it's imported at top
  // For this edit, I will add the import at the top in a separate chunk or rely on the user to have added it.
  // Actually, I should add the import. I'll do it in a separate chunk to be safe, or I can try to find where to insert it.
  // Let's assume I can add it at the top.

  const handleBuyNowClick = () => {
    if (!user) {
      alert("Please login to purchase.");
      return;
    }
    setIsBuyNowModalOpen(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Dynamic import to avoid top-level relative path issues if I mess up
    const { handlePayment } = await import("../utils/payment");

    const items = [
      {
        id: product.id,
        name: product.name,
        quantity: quantity,
        price: product.price,
      },
    ];

    // Calculate total amount (Price * Qty). No shipping, No Tax.
    const subtotal = product.price * quantity;
    const totalAmount = subtotal;

    await handlePayment(
      {
        ...product,
        price: totalAmount, // Pass total amount including tax
        items: items,
      },
      {
        name: user.fullName || "Customer",
        email: user.email,
        ...checkoutDetails,
      },
      (successData) => {
        setIsProcessingPayment(false);
        setIsBuyNowModalOpen(false);
        alert("Payment Successful! Order ID: " + successData.message);
        // Optionally redirect to orders page
      },
      (errorMessage) => {
        setIsProcessingPayment(false);
        alert("Payment Failed: " + errorMessage);
      },
    );
  };

  // Helper functions for specifications
  const formatSpecKey = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getSpecIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes("time") || k.includes("duration")) return "schedule";
    if (k.includes("volume") || k.includes("capacity")) return "local_drink";
    if (k.includes("weight") || k.includes("mass")) return "weight";
    if (
      k.includes("size") ||
      k.includes("dimension") ||
      k.includes("width") ||
      k.includes("height")
    )
      return "straighten";
    if (k.includes("color") || k.includes("finish")) return "palette";
    if (k.includes("material")) return "category";
    if (k.includes("temp") || k.includes("heat")) return "thermostat";
    return "info"; // Default icon
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* ... previous breadcrumbs and layout ... */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-zinc-500">
        <Link className="hover:text-brand-red transition-colors" to="/">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-brand-red transition-colors" to="/shop">
          Shop
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* ... image section ... */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative group aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <div
              className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: `url('${selectedImage || product.image_url}')`,
              }}
            ></div>
            <div className="absolute top-4 left-4">
              <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Premium Grade
              </span>
              {(product.stock === 0 || product.stock === null) && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ml-2">
                  Out of Stock
                </span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest ml-2">
                  Low Stock: {product.stock}
                </span>
              )}
            </div>
          </div>
          {/* Thumbnail Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? "border-brand-red opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Side */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-4 uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-brand-red">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined ${
                      i < Math.floor(product.rating || 0) ? "fill-1" : ""
                    }`}
                  >
                    {i < Math.floor(product.rating || 0)
                      ? "star"
                      : i < (product.rating || 0)
                        ? "star_half"
                        : "star"}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                {product.review_count || 0} Glosmax Reviews
              </span>
            </div>
            <p className="text-3xl font-bold text-brand-red">
              ₹{(product.price || 0).toLocaleString("en-IN")}
            </p>
            {product.stock > 0 ? (
              <p className="text-green-500 text-sm font-bold uppercase tracking-widest mt-2">
                In Stock
              </p>
            ) : (
              <p className="text-red-500 text-sm font-bold uppercase tracking-widest mt-2">
                Out of Stock
              </p>
            )}
          </div>

          <div className="mb-8 p-6 bg-zinc-900 rounded-xl border border-zinc-700">
            <p className="text-zinc-400 leading-relaxed mb-6 font-medium">
              {product.description_short}
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Quantity
                </label>
                <div className="flex items-center border border-zinc-600 rounded-lg overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 hover:bg-zinc-700 transition-colors text-white"
                  >
                    -
                  </button>
                  <input
                    className="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-bold text-white outline-none"
                    type="number"
                    value={quantity}
                    readOnly
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock || 1, quantity + 1))
                    }
                    disabled={quantity >= (product.stock || 0)}
                    className="px-4 hover:bg-zinc-700 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock <= 0}
                  className="flex-1 bg-brand-red hover:bg-brand-red-dark text-white font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs italic shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <span className="material-symbols-outlined text-lg filled-icon">
                    shopping_bag
                  </span>
                  {!product.stock || product.stock <= 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNowClick}
                  disabled={!product.stock || product.stock <= 0}
                  className="flex-1 bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red/10 font-black py-4 rounded-lg transition-all transform active:scale-95 uppercase tracking-widest text-xs italic disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:transform-none"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Quick Features List */}
          {features && features.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-sm font-black uppercase italic tracking-wider mb-4 text-white/80">
                Highlights
              </h4>
              <ul className="space-y-2">
                {features.slice(0, 3).map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-zinc-400"
                  >
                    <span className="material-symbols-outlined text-brand-red text-lg">
                      check_circle
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Details Tabs Section */}
      <div className="border-t border-white/10 pt-16">
        <div className="flex flex-wrap gap-8 border-b border-white/10 mb-12">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${
              activeTab === "description"
                ? "text-brand-red"
                : "text-white/40 hover:text-white"
            }`}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${
              activeTab === "specs"
                ? "text-brand-red"
                : "text-white/40 hover:text-white"
            }`}
          >
            Specifications
            {activeTab === "specs" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${
              activeTab === "reviews"
                ? "text-brand-red"
                : "text-white/40 hover:text-white"
            }`}
          >
            Reviews ({reviews.length})
            {activeTab === "reviews" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red"></span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === "description" && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-black uppercase italic text-white">
                  Product <span className="text-brand-red">Details</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  {product.long_description || product.description_short}
                </p>
              </div>
              <div className="bg-surface-dark p-8 rounded-xl border border-white/5">
                <h4 className="text-xl font-bold uppercase italic mb-6">
                  Key Features
                </h4>
                <ul className="space-y-4">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-brand-red/10 flex items-center justify-center text-brand-red">
                        <span className="material-symbols-outlined text-sm">
                          bolt
                        </span>
                      </div>
                      <span className="text-zinc-300 font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-black uppercase italic text-white mb-8">
                Technical <span className="text-brand-red">Specs</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {Object.entries(specs).map(([key, value], idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-4 border-b border-white/5 group hover:bg-white/5 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-brand-red text-xl">
                        {getSpecIcon(key)}
                      </span>
                      <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold group-hover:text-zinc-300 transition-colors">
                        {formatSpecKey(key)}
                      </span>
                    </div>
                    <span className="text-white font-medium text-right">
                      {value}
                    </span>
                  </div>
                ))}
                {Object.keys(specs).length === 0 && (
                  <p className="text-zinc-500 italic">
                    No detailed specifications available for this product.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-fade-in max-w-4xl">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black uppercase italic text-white">
                  Customer <span className="text-brand-red">Feedback</span>
                </h3>
                <button
                  onClick={() => {
                    if (user) setIsReviewModalOpen(true);
                    else alert("Please login to write a review");
                  }}
                  className="px-6 py-2 border border-white/20 hover:border-brand-red text-white hover:text-brand-red rounded uppercase text-xs font-bold tracking-widest transition-colors"
                >
                  Write a Review
                </button>
              </div>

              <div className="space-y-8">
                {reviews.map((review) => (
                  <div
                    key={review.id || Math.random()}
                    className="bg-surface-dark p-8 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center font-bold text-white/50">
                          {(review.user || "A").charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-bold text-white">
                            {review.user || "Anonymous"}
                          </h5>
                          <span className="text-xs text-zinc-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-brand-red">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined text-sm ${i < (review.rating || 0) ? "fill-1" : "text-zinc-700"}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-12 bg-white/5 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-white/20 mb-4">
                      rate_review
                    </span>
                    <p className="text-zinc-500">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          ></div>
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 w-full max-w-lg relative z-10 shadow-2xl">
            <h3 className="text-2xl font-black uppercase italic text-white mb-6">
              Write a Review
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-white/50">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`focus:outline-none transition-colors ${star <= reviewRating ? "text-brand-red" : "text-zinc-700"}`}
                    >
                      <span className="material-symbols-outlined text-3xl filled-icon">
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-white/50">
                  Review
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded p-4 text-white h-32 focus:border-brand-red/50 focus:outline-none transition-colors"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-white/50 hover:text-white uppercase text-xs font-bold tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-8 py-3 bg-brand-red text-white font-black uppercase italic tracking-widest rounded hover:bg-brand-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Buy Now / Checkout Modal */}
      {isBuyNowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsBuyNowModalOpen(false)}
          ></div>
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black uppercase italic text-white mb-6">
              Checkout <span className="text-brand-red">Details</span>
            </h3>

            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/5 flex gap-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded bg-black"
              />
              <div>
                <h4 className="font-bold text-white">{product.name}</h4>
                <p className="text-xs text-white/50">Qty: {quantity}</p>
                <p className="text-brand-red font-bold">
                  Total: ₹{(product.price * quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/50">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={checkoutDetails.phoneNumber}
                  onChange={(e) =>
                    setCheckoutDetails({
                      ...checkoutDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-brand-red/50 focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/50">
                    House No.
                  </label>
                  <input
                    type="text"
                    value={checkoutDetails.house}
                    onChange={(e) =>
                      setCheckoutDetails({
                        ...checkoutDetails,
                        house: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-brand-red/50 focus:outline-none"
                    placeholder="House/Flat"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/50">
                    Street
                  </label>
                  <input
                    type="text"
                    value={checkoutDetails.street}
                    onChange={(e) =>
                      setCheckoutDetails({
                        ...checkoutDetails,
                        street: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-brand-red/50 focus:outline-none"
                    placeholder="Street Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/50">
                    City
                  </label>
                  <input
                    type="text"
                    value={checkoutDetails.city}
                    onChange={(e) =>
                      setCheckoutDetails({
                        ...checkoutDetails,
                        city: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-brand-red/50 focus:outline-none"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/50">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={checkoutDetails.pincode}
                    onChange={(e) =>
                      setCheckoutDetails({
                        ...checkoutDetails,
                        pincode: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:border-brand-red/50 focus:outline-none"
                    placeholder="Pin Code"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-brand-red text-white font-black uppercase italic tracking-widest py-4 rounded-xl hover:bg-brand-red-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBuyNowModalOpen(false)}
                  className="w-full text-white/40 font-bold uppercase tracking-widest text-xs py-3 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
