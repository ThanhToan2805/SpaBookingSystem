import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Home from "../pages/home/Home";
import ServicesList from "../pages/services/ServicesList";
import ServiceDetail from "../pages/services/ServiceDetail";
import BookingForm from "../pages/bookings/BookingForm";
import MyBookings from "../pages/bookings/MyBookings";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import CategoriesList from "../pages/categories/CategoriesList";
import StaffList from "../pages/staffs/StaffList";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth/signin" />;
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/staffs" element={<StaffList />} />
      </Routes>
    </Router>
  );
}