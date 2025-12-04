import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/auth/signin" />;

  const role =
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role !== "Admin") {
    return <Navigate to="/" />; // chặn user thường
  }

  return children;
}