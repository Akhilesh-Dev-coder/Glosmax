import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-black">
        <div className="text-white text-xl animate-pulse">
          Checking Permissions...
        </div>
      </div>
    );
  }

  // If not logged in, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, go to home
  if (!user.admin) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render children routes
  return <Outlet />;
};

export default AdminRoute;
