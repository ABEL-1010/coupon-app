import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, send user back to login page
    return <Navigate to="/" replace />;
  }

  // If token exists, show the requested page
  return children;
}
