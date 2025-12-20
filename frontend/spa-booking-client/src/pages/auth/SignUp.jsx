import { useState } from "react";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import EyeIcon from "../../components/icons/EyeIcon";
import EyeOffIcon from "../../components/icons/EyeOffIcon";

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await authApi.register(payload);
      alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
      navigate("/auth/signin");
    } catch (err) {
      alert(
        "Đăng ký thất bại: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-50">
          <h2 className="text-3xl font-bold mb-2 text-center text-purple-700">
            Đăng Ký
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Đăng ký tài khoản hệ thống LumiSpa để sử dụng dịch vụ.
          </p>

          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="Username"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 font-medium transition"
            >
              Đăng ký
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/auth/signin"
              className="text-purple-600 font-medium hover:underline"
            >
              Đăng Nhập
            </Link>
          </p>
        </div>
      </div>
    </LayoutWrapper>
  );
}