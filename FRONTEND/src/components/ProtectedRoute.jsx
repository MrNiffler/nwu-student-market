// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, addNotification }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    if (addNotification) {
      addNotification("Please sign in to access this page", "error");
    }
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
