import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/authContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // redirect to login with redirect info
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
