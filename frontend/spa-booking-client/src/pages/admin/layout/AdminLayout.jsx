import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminLayout({ children, title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Spa Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className="block px-4 py-2 rounded hover:bg-blue-100 font-semibold"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/categories"
            className="block px-4 py-2 rounded hover:bg-blue-100 font-semibold"
          >
            Quản lý Category
          </Link>
          <Link
            to="/admin/services"
            className="block px-4 py-2 rounded hover:bg-blue-100 font-semibold"
          >
            Quản lý Service
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="mb-2 text-gray-700">Hello, {user?.username}</div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              ← Back
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}