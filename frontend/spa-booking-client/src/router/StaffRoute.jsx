// src/router/StaffRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function StaffRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth/signin" />;

  const role =
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  // Chỉ cho Staff (và optionally Admin) vào dashboard staff
  if (role !== "Staff") {
    return <Navigate to="/" />;
  }

  return children;
}