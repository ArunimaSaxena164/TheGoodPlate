// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/authContext.jsx";

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     // redirect to login with redirect info
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />;
//   }

//   return children;
// }
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/authContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // 1. While checking auth, don't redirect
  if (loading) {
    return <div>Loading...</div>;
  }

  // 2. If no token exists, user is not logged in
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 3. Token exists, allow route EVEN IF user loads a moment later
  return children;
}
