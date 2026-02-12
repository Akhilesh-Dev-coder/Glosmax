import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();

  // Checkout State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    phoneNumber: "",
    house: "",
    street: "",
    town: "",
    city: "",
    pincode: "",
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleCheckoutClick = () => {
    if (!user) {
      alert("Please login to checkout.");
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    const { handlePayment } = await import("../utils/payment");

    // WE pass the first item's ID but the FULL total amount.
    // This allows the payment to process for the correct amount.
    const firstItem = cart[0];
    const shipping = 0; // Free shipping
    const finalTotal = cartTotal + shipping;

    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    await handlePayment(
      {
        id: firstItem.id, // Placeholder ID
        price: finalTotal, // OVERRIDE price with total cart value
        name: "Cart Order (" + cart.length + " items)", // Description override
        items: items, // Pass items array
      },
      {
        name: user.fullName || "Customer",
        email: user.email,
        ...checkoutDetails,
      },
      (successData) => {
        setIsProcessingPayment(false);
        setIsCheckoutModalOpen(false);
        alert("Payment Successful! Order ID: " + successData.message);
        // Ideally clear cart here
        // clearCart();
      },
      (errorMessage) => {
        setIsProcessingPayment(false);
        alert("Payment Failed: " + errorMessage);
      },
    );
  };
  const shipping = 0; // Free shipping
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-background-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background-black to-background-black pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold mb-4">
              <Link className="hover:text-brand-red transition-colors" to="/">
                Home
              </Link>
              <span className="material-symbols-outlined text-[10px]">
                chevron_right
              </span>
              <span className="text-brand-red">Your Cart</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-600">
                Garage
              </span>
            </h1>
          </div>
          <Link
            className="flex items-center gap-2 group text-zinc-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors"
            to="/shop"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border border-white/5 rounded-3xl bg-surface-dark/30 backdrop-blur-md">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-white/20">
                shopping_cart_off
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase italic text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
              You haven't added any professional gear to your garage yet.
            </p>
            <Link
              to="/shop"
              className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-surface-dark/40 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/5 hover:border-brand-red/30 transition-all flex flex-col sm:flex-row items-center gap-6 md:gap-8 overflow-hidden"
                >
                  {/* Image */}
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-black rounded-2xl flex-shrink-0 overflow-hidden border border-white/5">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={item.image}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-grow text-center sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase italic leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-brand-red font-bold uppercase tracking-widest mt-1">
                          Premium Series
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-white/10 transition-colors mx-auto sm:mx-0"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-auto">
                      {/* Quantity Control */}
                      <div className="flex items-center bg-black/50 rounded-xl p-1 border border-white/10 mx-auto sm:mx-0">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>

                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <span className="text-zinc-500 text-[10px] block uppercase tracking-widest font-bold mb-1">
                          Total Price
                        </span>
                        <span className="text-2xl font-black text-white">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-surface-dark/60 backdrop-blur-xl rounded-3xl p-8 border border-white/5 sticky top-28 shadow-2xl shadow-black/50">
                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 text-white flex items-center gap-2">
                  <span className="text-brand-red material-symbols-outlined">
                    receipt_long
                  </span>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">Subtotal</span>
                    <span className="font-bold text-white">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">Shipping</span>
                    <span className="text-green-500 font-bold">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-end mb-8">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    Total
                  </span>
                  <span className="text-4xl font-black text-white leading-none">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-brand-red hover:bg-red-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <span className="material-symbols-outlined text-base relative z-10 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                </button>

                <p className="text-center mt-6 text-[10px] text-zinc-600 font-medium">
                  Secure checkout powered by Glosmax Pay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCheckoutModalOpen(false)}
          ></div>
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black uppercase italic text-white mb-6">
              Checkout <span className="text-brand-red">Details</span>
            </h3>

            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
              <h4 className="font-bold text-white mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm text-zinc-400">
                <span>Items ({cart.length})</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-white font-bold mt-2 pt-2 border-t border-white/10">
                <span>Total Payable</span>
                <span className="text-brand-red">
                  ₹
                  {(cartTotal + 0) // Shipping is free
                    .toLocaleString("en-IN")}
                </span>
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
                  onClick={() => setIsCheckoutModalOpen(false)}
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

export default Cart;
