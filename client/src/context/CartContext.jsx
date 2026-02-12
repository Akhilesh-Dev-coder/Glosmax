import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("glosmax_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart state with User state
  useEffect(() => {
    if (user) {
      // User is logged in: Restore cart from DB
      setCart(user.cart || []);
    } else {
      // User is logged out: Clear cart
      setCart([]);
    }
  }, [user]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("glosmax_cart", JSON.stringify(cart));
  }, [cart]);

  // Sync cart TO backend when it changes
  useEffect(() => {
    if (!user || !token) return;

    const timeoutId = setTimeout(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            console.error("Failed to sync cart:", data.error);
          } else {
            console.log("Cart synced successfully");
          }
        })
        .catch((err) => console.error("Error syncing cart:", err));
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [cart, user, token]);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const showNotification = (message) => {
    setNotification({ show: true, message });
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showNotification("Please login to add items to cart");
      navigate("/login");
      return;
    }

    // Check if adding exceeds stock
    const currentStock = product.stock !== undefined ? product.stock : 9999;
    const existingItem = cart.find((item) => item.id === product.id);
    const potentialQuantity =
      (existingItem ? existingItem.quantity : 0) + quantity;

    if (currentStock !== null && potentialQuantity > currentStock) {
      showNotification(`Out of stock! Only ${currentStock} available.`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    showNotification(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cart.find((i) => i.id === productId);
    if (item && item.stock !== undefined && item.stock !== null) {
      if (newQuantity > item.stock) {
        showNotification(`Cannot add more. Only ${item.stock} in stock.`);
        return;
      }
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
      <Toast
        message={notification.message}
        isVisible={notification.show}
        onClose={closeNotification}
      />
    </CartContext.Provider>
  );
};
