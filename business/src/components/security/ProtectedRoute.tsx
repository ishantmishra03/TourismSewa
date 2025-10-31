// Only allow when user is logged in

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}
