import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// User pages
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Home from "../pages/home/HomePage";
import ServicesList from "../pages/services/ServicesList";
import ServiceDetail from "../pages/services/ServiceDetail";
import BookingForm from "../pages/bookings/BookingForm";
import MyBookings from "../pages/bookings/MyBookings";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import CategoriesList from "../pages/categories/CategoriesList";
import StaffList from "../pages/staffs/StaffList";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import CategoryList from "../pages/admin/categories/CategoryList";
import CategoryForm from "../pages/admin/categories/CategoryForm";
import ServiceList from "../pages/admin/services/ServiceList";
import ServiceForm from "../pages/admin/services/ServiceForm";

// Middlewares
import { useAuth } from "../contexts/AuthContext";
import AdminRoute from "./AdminRoute";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth/signin" />;
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/staffs" element={<StaffList />} />

        {/* USER PRIVATE ROUTES */}
        <Route
          path="/booking"
          element={<PrivateRoute><BookingForm /></PrivateRoute>}
        />
        <Route
          path="/my-bookings"
          element={<PrivateRoute><MyBookings /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />
        <Route
          path="/profile/edit"
          element={<PrivateRoute><EditProfile /></PrivateRoute>}
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        {/* CATEGORY MANAGEMENT */}
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <CategoryList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/create"
          element={
            <AdminRoute>
              <CategoryForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories/edit/:id"
          element={
            <AdminRoute>
              <CategoryForm />
            </AdminRoute>
          }
        />

        {/* SERVICE MANAGEMENT */}
        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <ServiceList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services/create"
          element={
            <AdminRoute>
              <ServiceForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services/edit/:id"
          element={
            <AdminRoute>
              <ServiceForm />
            </AdminRoute>
          }
        />

      </Routes>
    </Router>
  );
}