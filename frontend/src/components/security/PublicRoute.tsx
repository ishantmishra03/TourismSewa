// Only allow when user is logged out

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/useAuth";

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/map" /> : <Outlet />;
}
