import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to home if user is not authenticated
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @param {string} requiredToken - The token type required ('company' or 'admin')
 */
const ProtectedRoute = ({ children, requiredToken = "company" }) => {
  const { companyToken, adminToken } = useContext(AppContext);

  // Determine which token to check based on requiredToken prop
  const isAuthenticated = requiredToken === "admin" ? adminToken : companyToken;

  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;

