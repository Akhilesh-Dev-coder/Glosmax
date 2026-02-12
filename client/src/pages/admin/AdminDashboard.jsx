import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

const AdminDashboard = () => {
  const { products } = useProducts();
  const [dashboardStats, setDashboardStats] = React.useState({
    totalSales: 0,
    activeOrders: 0,
    totalOrders: 0,
    recentOrders: [],
    loading: true,
  });

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/orders/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setDashboardStats({
            totalSales: data.stats.totalSales || 0,
            activeOrders: data.stats.activeOrders || 0,
            totalOrders: data.stats.totalOrders || 0,
            recentOrders: data.stats.recentOrders || [],
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setDashboardStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Calculate stats from real data
  const totalProducts = products.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(dashboardStats.totalSales),
      icon: "payments",
      trend: "+12%", // Placeholder trend for now
      trendUp: true,
      color: "from-brand-red/20 to-brand-red/5",
      link: "/admin/orders",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: "inventory_2",
      trend: "Stock",
      trendUp: true,
      color: "from-emerald-500/20 to-emerald-500/5",
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders.toString(),
      icon: "receipt_long",
      trend: "Lifetime",
      trendUp: true,
      color: "from-orange-500/20 to-orange-500/5",
      link: "/admin/orders",
    },
  ];

  /*
  // We'll map dashboardStats.recentOrders directly in the JSX
  const recentOrders = dashboardStats.recentOrders.map(order => ({
      id: `GLX-${order.id}`, // Assuming simple ID for now, or use order.id directly
      customer: order.user_name,
      product: "Order #" + order.id, // We might not have product names in the stats query if just fetching orders table.
      // Actually, orders table DOES NOT have product name, only product_id.
      // To get product name we'd need to JOIN products table in the backend query.
      // For now, let's just show "Product ID: ..." or simpler
      amount: formatCurrency(order.amount),
      status: order.payment_status || "Pending",
      date: new Date(order.created_at).toLocaleDateString()
  }));
  */

  // Helper to find product name (since we have products context loaded!)
  const getProductName = (pid) => {
    const p = products.find((prod) => prod.id === pid);
    return p ? p.name : `Product #${pid}`;
  };

  const recentOrders = dashboardStats.recentOrders.map((order) => ({
    id: `GLX-${order.id}`,
    customer: order.user_name,
    product: getProductName(order.product_id),
    amount: formatCurrency(order.amount),
    status: order.payment_status
      ? order.payment_status.charAt(0).toUpperCase() +
        order.payment_status.slice(1)
      : "Pending",
    date: new Date(order.created_at).toLocaleDateString(), // Simplification
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Pending":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Processing":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Overview
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
            Command{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-white">
              Center
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-mono">
            Last Updated: Just now
          </span>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Link
            to={stat.link}
            key={index}
            className={`relative overflow-hidden bg-surface-dark/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 group hover:-translate-y-1 transition-transform duration-300 block`}
          >
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`}
            ></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-white/80">
                  {stat.icon}
                </span>
              </div>
              <span
                className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                  stat.trendUp
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {stat.trend}
                <span className="material-symbols-outlined text-sm">
                  {stat.trendUp ? "trending_up" : "trending_down"}
                </span>
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">
                {stat.title}
              </h3>
              <p className="text-2xl md:text-3xl font-black italic text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Orders Table (Hidden on Mobile) */}
        <div className="lg:col-span-2 bg-surface-dark/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Live Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-brand-red uppercase tracking-widest hover:text-white transition-colors"
            >
              View All Activity
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
                <tr>
                  <th className="pb-4 pl-4">Order</th>
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right pr-4">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 pl-4">
                      <span className="block text-white font-bold">
                        {order.customer}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        {order.id}
                      </span>
                    </td>
                    <td className="py-4 text-white/70">{order.product}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-4 font-mono text-brand-red font-bold">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (Replaces Table) */}
          <div className="md:hidden space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {order.customer}
                    </h4>
                    <span className="text-xs text-white/40 font-mono">
                      {order.id}
                    </span>
                  </div>
                  <span className="font-black italic text-brand-red text-sm">
                    {order.amount}
                  </span>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/50">{order.product}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Notifications Side */}
        <div className="bg-gradient-to-b from-brand-red/10 to-transparent border border-brand-red/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 blur-[60px]"></div>

          <h3 className="text-lg font-black uppercase italic mb-6 relative z-10">
            Quick Actions
          </h3>

          <div className="space-y-3 relative z-10">
            <Link
              to="/admin/products"
              className="w-full bg-surface-dark hover:bg-brand-red border border-white/10 hover:border-brand-red/50 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-brand-red group-hover:text-white">
                  add_box
                </span>
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">
                Add Product
              </span>
            </Link>
            <Link
              to="/admin/orders"
              className="w-full bg-surface-dark hover:bg-blue-600 border border-white/10 hover:border-blue-500/50 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined text-blue-500 group-hover:text-white">
                  local_shipping
                </span>
              </div>
              <span className="text-sm font-bold uppercase tracking-widest">
                Ship Orders
              </span>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              System Status
            </h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-emerald-400">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
