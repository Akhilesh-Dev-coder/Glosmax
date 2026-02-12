import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assuming AuthContext provides user/token info if needed

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Failed to fetch orders:", data.error);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((o) => o.id !== orderId));
      } else {
        alert("Failed to delete order: " + data.error);
      }
    } catch (err) {
      alert("Error deleting order");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, payment_status: newStatus } : o,
          ),
        );
      } else {
        alert("Failed to update status: " + data.error);
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order List", 14, 22);

    const tableData = orders.map((order) => [
      order.id,
      order.user_name || "Unknown",
      order.phone_number || "",
      [order.house, order.street, order.city, order.pincode]
        .filter(Boolean)
        .join(", "),
      new Date(order.created_at).toLocaleDateString(),
      `Rs. ${order.amount}`,
      order.payment_status,
    ]);

    autoTable(doc, {
      head: [
        ["ID", "Customer", "Phone", "Address", "Date", "Amount", "Status"],
      ],
      body: tableData,
      startY: 30,
    });

    doc.save("orders.pdf");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "pending":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "processing":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "failed":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  if (loading) return <div className="p-8 text-white">Loading orders...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <span className="material-symbols-outlined text-sm">
              shopping_cart
            </span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Fulfillment
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Order{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-white">
              History
            </span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToPDF}
            className="bg-surface-dark border border-white/10 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-white/30 hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-xs font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
              <tr>
                <th className="pb-4 pl-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Shipping Details</th>
                <th className="pb-4">Items</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 pl-4 font-mono text-brand-red/80">
                    {order.id}
                  </td>
                  <td className="py-4 font-bold text-white">
                    {order.user_name || "Unknown"}
                  </td>
                  <td className="py-4 text-xs text-zinc-400 max-w-xs">
                    <div className="font-bold text-white mb-1">
                      {order.phone_number}
                    </div>
                    <div>
                      {[order.house, order.street, order.city, order.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </td>
                  <td className="py-4 text-white/80 text-xs">
                    {order.items && order.items.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="block">
                            <span className="text-white font-bold">
                              {item.name}
                            </span>
                            <span className="text-white/50 ml-1">
                              x{item.quantity}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white/60 font-medium">
                        {order.legacy_product_name ||
                          `Product #${order.product_id}`}
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-white/60">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 font-mono text-white font-bold">
                    ₹{order.amount}
                  </td>
                  <td className="py-4">
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-transparent cursor-pointer ${getStatusColor(
                        order.payment_status,
                      )}`}
                    >
                      <option
                        value="pending"
                        className="bg-surface-dark text-white"
                      >
                        Pending
                      </option>
                      <option
                        value="success"
                        className="bg-surface-dark text-white"
                      >
                        Success
                      </option>
                      <option
                        value="failed"
                        className="bg-surface-dark text-white"
                      >
                        Failed
                      </option>
                      {/* Add fulfillment statuses if supported by backend later */}
                    </select>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-white/40">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm">
                      {order.user_name}
                    </h3>
                    <span className="text-[10px] text-white/40 font-mono bg-white/5 px-1 rounded">
                      {order.id}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-black italic text-brand-red text-lg">
                  ₹{order.amount}
                </span>
              </div>

              {/* Mobile Address Block */}
              <div className="bg-white/5 rounded-lg p-3 text-xs text-zinc-400 border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-white font-bold">
                  <span className="material-symbols-outlined text-sm text-brand-red">
                    local_shipping
                  </span>
                  Shipping Details
                </div>
                <div className="pl-6">
                  <div className="text-white mb-0.5">{order.phone_number}</div>
                  <div className="leading-relaxed">
                    {[order.house, order.street, order.city, order.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </div>

              {/* Mobile Items List */}
              <div className="bg-white/5 rounded-lg p-3">
                {order.items && order.items.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                        <span className="text-white/50">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/60 font-medium text-xs">
                    {order.legacy_product_name ||
                      `Product ID: ${order.product_id}`}
                  </span>
                )}
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(
                    order.payment_status,
                  )}`}
                >
                  {order.payment_status}
                </span>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
