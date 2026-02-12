import React, { useState } from "react";
import { useProducts } from "../../context/ProductContext";

const AdminProducts = () => {
  const { products, createProduct, deleteProduct, updateProduct, loading } =
    useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
    images: [], // List of URL strings (existing images)
    files: [], // List of File objects (new images)
    description_short: "",
    long_description: "",
    category: "Exterior Care",
    tag: "",
    features: [],
    specifications: {},
  });

  // Helper to handle JSON-like string inputs for simplicity or multiple inputs
  // For this demo, let's keep features as a comma-separated string in input, converted to array on submit
  const [featuresInput, setFeaturesInput] = useState("");
  const [specsInput, setSpecsInput] = useState(""); // Key:Value,Key:Value

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setEditingId(product.id);

    // Ensure images is an array
    let currentImages = product.images || [];
    if (currentImages.length === 0 && product.image_url) {
      currentImages = [product.image_url];
    }

    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock || 0,
      image_url: product.image_url,
      images: currentImages,
      files: [],
      description_short: product.description_short || "",
      long_description: product.long_description || "",
      category: product.category || "Exterior Care",
      tag: product.tag || "",
      features: product.features || [],
      specifications: product.specifications || {},
    });
    setFeaturesInput((product.features || []).join(", "));
    setSpecsInput(
      Object.entries(product.specifications || {})
        .map(([k, v]) => `${k}:${v}`)
        .join(", "),
    );
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      stock: "",
      image_url: "",
      images: [],
      files: [],
      description_short: "",
      long_description: "",
      category: "Exterior Care",
      tag: "",
      features: [],
      specifications: {},
    });
    setFeaturesInput("");
    setSpecsInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process features
    const featuresArray = featuresInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    // Process specs
    const specsObj = {};
    specsInput.split(",").forEach((pair) => {
      const [key, value] = pair.split(":");
      if (key && value) specsObj[key.trim()] = value.trim();
    });

    // Create FormData
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("stock", formData.stock);
    formDataObj.append("description_short", formData.description_short);
    formDataObj.append("long_description", formData.long_description);
    formDataObj.append("category", formData.category);
    formDataObj.append("tag", formData.tag);

    // Append JSON strings for arrays/objects
    formDataObj.append("features", JSON.stringify(featuresArray));
    formDataObj.append("specifications", JSON.stringify(specsObj));
    formDataObj.append("images", JSON.stringify(formData.images)); // Existing images as JSON string

    // Append new image files
    if (formData.files && formData.files.length > 0) {
      Array.from(formData.files).forEach((file) => {
        formDataObj.append("images", file);
      });
    }

    // For CREATE, check if file is present
    if (!editMode && (!formData.files || formData.files.length === 0)) {
      alert("Please select at least one image file.");
      return;
    }

    let result;
    if (editMode && editingId) {
      result = await updateProduct(editingId, formDataObj);
    } else {
      result = await createProduct(formDataObj);
    }

    if (result.success) {
      closeAndResetModal();
    } else {
      alert("Error saving product: " + result.error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      // Allow appending to existing file selection if creating, or just replacing?
      // Standard file input behavior is replace. But for "multiple", users often expect to add.
      // However, input type="file" always replaces its value.
      // To support "adding", we need to manage state carefully.
      // Let's implement keeping previous files + new ones.
      const selectedFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...selectedFiles],
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <span className="material-symbols-outlined text-sm">
              inventory_2
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Catalog
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Product{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-white">
              Manager
            </span>
          </h1>
        </div>
        <button
          onClick={() => {
            setEditMode(false);
            setIsModalOpen(true);
          }}
          className="bg-brand-red hover:bg-brand-red-dark text-white px-6 py-3 rounded-xl text-sm font-black uppercase italic tracking-widest transition-all shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Add New Product
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center text-white/50 py-10">
            Loading Products...
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-xs font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
                  <tr>
                    <th className="pb-4 pl-4">Product Detail</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Rating</th>
                    <th className="pb-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-white/10 group-hover:border-brand-red/50 transition-colors"
                          />
                          <span className="font-bold text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-brand-red font-bold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 font-mono text-white/70">
                        {product.stock || 0}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/10">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <span className="material-symbols-outlined text-sm filled-icon">
                            star
                          </span>
                          <span className="text-white font-bold">
                            {product.rating || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-black/40 border border-white/5 rounded-xl p-4 flex gap-4"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-white/10"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-sm line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="font-mono text-brand-red font-black text-sm">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        Stock: {product.stock || 0} | {product.category}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                        <span className="material-symbols-outlined text-sm filled-icon">
                          star
                        </span>
                        {product.rating || 0}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/70 hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeAndResetModal}
          ></div>
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
            <h2 className="text-2xl font-black uppercase italic text-white mb-6">
              {editMode ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase font-bold text-white/50">
                  Product Images
                </label>

                {/* Existing Images */}
                {editMode && formData.images && formData.images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/30">Existing Images</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-20">
                          <img
                            src={img}
                            alt={`Existing ${idx}`}
                            className="w-full h-full object-cover rounded border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter(
                                (_, i) => i !== idx,
                              );
                              setFormData((prev) => ({
                                ...prev,
                                images: newImages,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-xs">
                              close
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New File Input */}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-red file:text-white hover:file:bg-brand-red-dark transition-all"
                />

                {/* New Files Preview */}
                {formData.files && formData.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/30">
                      New Images to Upload
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(formData.files).map((file, idx) => (
                        <div key={idx} className="relative group w-20 h-20">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx}`}
                            className="w-full h-full object-cover rounded border border-brand-red/30"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = Array.from(
                                formData.files,
                              ).filter((_, i) => i !== idx);
                              setFormData((prev) => ({
                                ...prev,
                                files: newFiles,
                              }));
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-xs">
                              close
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  >
                    <option>Exterior Care</option>
                    <option>Interior Care</option>
                    <option>Coatings</option>
                    <option>Wheels & Tires</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-white/50">
                    Tag
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                    placeholder="e.g. Best Seller"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">
                  Short Description
                </label>
                <input
                  type="text"
                  name="description_short"
                  value={formData.description_short}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">
                  Long Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white h-24"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  placeholder="Feature 1, Feature 2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/50">
                  Specifications (Key:Value, Key:Value)
                </label>
                <input
                  type="text"
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                  placeholder="Volume:50ml, Cure Time:24h"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAndResetModal}
                  className="px-4 py-2 text-white/50 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-red text-white font-bold rounded hover:bg-brand-red-dark"
                >
                  {editMode ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
