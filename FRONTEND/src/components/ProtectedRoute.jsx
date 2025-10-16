import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loadingUser } = useAuth();

  if (loadingUser) return <div>Loading...</div>; // show loader while fetching user
  if (!currentUser) return <Navigate to="/signin" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/signin" replace />;

  return children;
};

export default ProtectedRoute;
