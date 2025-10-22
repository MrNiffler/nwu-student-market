import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loadingUser } = useAuth();

  if (loadingUser) return <div>Loading...</div>; // wait for user info

  if (!currentUser) return <Navigate to="/signin" replace />;

  // if role is specified and user doesn't match, redirect to their default page
  if (role && currentUser.role !== role) {
    // if user is admin, go to /admin
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    // else go to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
