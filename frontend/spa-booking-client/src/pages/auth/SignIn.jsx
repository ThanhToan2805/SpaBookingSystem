import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import EyeIcon from "../../components/icons/EyeIcon";
import EyeOffIcon from "../../components/icons/EyeOffIcon";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const userData = await login({
        EmailOrUsername: data.username,
        Password: data.password,
      });

      const role =
        userData[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (role === "Admin") {
        navigate("/admin");
      } else if (role == "Staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/")
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(
        "Login failed: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-50">
          <h2 className="text-3xl font-bold mb-2 text-center text-purple-700">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Welcome back to LumiSpa. Please log in to manage your bookings.
          </p>

          <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username or Email
              </label>
              <input
                {...register("username")}
                placeholder="Enter username or email"
                className="border border-gray-300 p-3 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border border-gray-300 p-3 rounded-lg w-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </p>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-purple-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}