import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useSelector((state) => state?.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize role: treat "manager" and "owner" as the same
  const normalizedRole = role?.toLowerCase() === "manager" ? "owner" : role?.toLowerCase();

  // Support both single role and array of roles
  const allowedRoles = Array.isArray(requiredRole) 
    ? requiredRole.map(r => r.toLowerCase()) 
    : [requiredRole?.toLowerCase()];
  
  if (requiredRole && !allowedRoles.includes(normalizedRole)) {
    // Redirect to appropriate dashboard based on user role
    if (role?.toLowerCase() === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role?.toLowerCase() === "manager" || role?.toLowerCase() === "owner") {
      return <Navigate to="/owner" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
