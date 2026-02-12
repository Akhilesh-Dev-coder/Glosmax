import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      console.log("Sending product data:", productData);

      const isFormData = productData instanceof FormData;
      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${BACKEND_URL}/products`, {
        method: "POST",
        headers: headers,
        body: isFormData ? productData : JSON.stringify(productData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts(); // Refresh list
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Context createProduct Error:", err);
      return { success: false, error: "Network error: " + err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const isFormData = productData instanceof FormData;
      const headers = {};
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${BACKEND_URL}/products/${id}`, {
        method: "PUT",
        headers: headers,
        body: isFormData ? productData : JSON.stringify(productData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  const addReview = async (productId, reviewData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts(); // Refresh to show new rating/reviews
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: "Network error: " + err.message };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    createProduct,
    deleteProduct,
    updateProduct,
    addReview,
    refreshProducts: fetchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
