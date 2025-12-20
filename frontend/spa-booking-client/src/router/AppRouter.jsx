import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// User pages
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import Home from "../pages/home/HomePage";
import About from "../pages/home/AboutPage";
import Contact from "../pages/home/ContactPage";
import Blog from "../pages/home/BlogPage";
import ServicesList from "../pages/services/ServicesList";
import ServicesDetail from "../pages/services/ServicesDetail";
import BookingsForm from "../pages/bookings/BookingsForm";
import MyBookings from "../pages/bookings/MyBookings";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import CategoriesList from "../pages/categories/CategoriesList";
import StaffsList from "../pages/staffUI/StaffsList";
import ChangePassword from "../pages/auth/ChangePassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import PaymentPage from "../pages/payments/PaymentPage";
import VnPayReturnPage from "../pages/payments/VnPayReturnPage";
import FAQ from "../pages/home/FAQPage";
import PrivacyPolicy from "../pages/policy/PrivacyPolicy";
import Terms from "../pages/policy/Terms";
import RefundPolicy from "../pages/policy/RefundPolicy";
import BookingPolicy from "../pages/policy/BookingPolicy";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import CategoryList from "../pages/admin/categories/CategoryList";
import CategoryForm from "../pages/admin/categories/CategoryForm";
import ServiceList from "../pages/admin/services/ServiceList";
import ServiceForm from "../pages/admin/services/ServiceForm";
import ServiceDetail from "../pages/admin/services/ServiceDetail";
import StaffList from "../pages/admin/staffs/StaffList";
import StaffForm from "../pages/admin/staffs/StaffForm";
import StaffSchedule from "../pages/admin/staffs/StaffSchedule";
import StaffAnalytics from "../pages/admin/staffs/StaffAnalytics";
import UserList from "../pages/admin/users/UserList";
import UserForm from "../pages/admin/users/UserForm";
import RoleList from "../pages/admin/roles/RoleList";
import RoleForm from "../pages/admin/roles/RoleForm";
import PromotionList from "../pages/admin/promotions/PromotionList";
import PromotionForm from "../pages/admin/promotions/PromotionForm";
import BookingList from "../pages/admin/bookings/BookingList";
import BookingDetail from "../pages/admin/bookings/BookingDetail";
import PaymentList from "../pages/admin/payments/PaymentList";
import PaymentDetail from "../pages/admin/payments/PaymentDetail";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminChangePassword from "../pages/admin/AdminChangePassword";

// Staff pages
import StaffDashboard from "../pages/staffs/StaffDashBoard";
import StaffProfile from "../pages/staffs/profile/StaffProfile";
import StaffEditProfile from "../pages/staffs/profile/StaffEditProfile";
import StaffChangePassword from "../pages/staffs/StaffChangePassword";

// Middlewares
import { useAuth } from "../contexts/AuthContext";
import AdminRoute from "./AdminRoute";
import StaffRoute from "./StaffRoute";

// components
import ScrollToTop from "../components/common/ScrollToTop"

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth/signin" />;
}

export default function AppRouter() {
  return (
    <Router>
      <ScrollToTop />  {/* Quan trọng */}
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServicesDetail />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/staffs" element={<StaffsList />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/payment/:paymentId" element={<PaymentPage />} />
        <Route path="/payment/vnpay-return" element={<VnPayReturnPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/booking-policy" element={<BookingPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* USER PRIVATE ROUTES */}
        <Route
          path="/booking"
          element={<PrivateRoute><BookingsForm /></PrivateRoute>}
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
        <Route
          path="/auth/change-password"
          element={<PrivateRoute><ChangePassword /></PrivateRoute>}
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
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <AdminRoute>
              <AdminChangePassword />
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
        <Route
          path="/admin/services/:id"
          element={
            <AdminRoute>
              <ServiceDetail />
            </AdminRoute>
          }
        />

        {/* STAFF MANAGEMENT */}
        <Route
          path="/admin/staffs"
          element={
            <AdminRoute>
              <StaffList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staffs/create"
          element={
            <AdminRoute>
              <StaffForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staffs/edit/:id"
          element={
            <AdminRoute>
              <StaffForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staffs/:id/schedule"
          element={
            <AdminRoute>
              <StaffSchedule />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staffs/:id/analytics/"
          element={
            <AdminRoute>
              <StaffAnalytics />
            </AdminRoute>
          }
        />

        {/* USER MANAGEMENT */}
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <AdminRoute>
              <UserForm />
            </AdminRoute>
          }
        />

        {/* PROMOTION MANAGEMENT */}
        <Route
          path="/admin/promotions"
          element={
            <AdminRoute>
              <PromotionList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/promotions/create"
          element={
            <AdminRoute>
              <PromotionForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/promotions/edit/:id"
          element={
            <AdminRoute>
              <PromotionForm />
            </AdminRoute>
          }
        />

        {/* BOOKING MANAGEMENT */}
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <BookingList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings/:id"
          element={
            <AdminRoute>
              <BookingDetail />
            </AdminRoute>
          }
        />

        {/* PAYMENT MANAGEMENT */}
        <Route
          path="/admin/payments"
          element={
            <AdminRoute>
              <PaymentList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/payments/:id"
          element={
            <AdminRoute>
              <PaymentDetail />
            </AdminRoute>
          }
        />

        {/* STAFF ROUTES */}
        <Route
          path="/staff/dashboard"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <StaffRoute>
              <StaffProfile />
            </StaffRoute>
          }
        />
        <Route
          path="/staff/profile/edit"
          element={
            <StaffRoute>
              <StaffEditProfile />
            </StaffRoute>
          }
        />
        <Route
          path="/staff/change-password"
          element={
            <StaffRoute>
              <StaffChangePassword />
            </StaffRoute>
          }
        />

      </Routes>
    </Router>
  );
}