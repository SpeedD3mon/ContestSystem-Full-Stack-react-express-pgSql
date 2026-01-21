import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  roles?: Array<"admin" | "vip" | "signed-in">; // Allowed roles
  redirectTo?: string; // Redirect if not allowed
}

/**
 * Usage:
 * <ProtectedRoute roles={['VIP', 'ADMIN']} redirectTo="/login" />
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, redirectTo = "/login" }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Not logged in → redirect to login
    return <Navigate to={redirectTo} replace />;
  }

  if (roles && !roles.includes(currentUser!.user.role)) {
    // Logged in but role not allowed → redirect to home
    return <Navigate to="/" replace />;
  }

  // User is allowed → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
