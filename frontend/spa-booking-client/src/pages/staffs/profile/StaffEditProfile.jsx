// src/pages/staffs/StaffEditProfile.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../../api/userApi";
import StaffLayout from "../layout/StaffLayout";

export default function StaffEditProfile() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getProfile()
      .then((data) => {
        reset(data);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        alert("Không tải được hồ sơ người dùng");
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = (data) => {
    userApi
      .updateProfile(data)
      .then(() => {
        alert("Cập nhật hồ sơ thành công");
        navigate("/staff/profile");
      })
      .catch((err) => {
        console.error("Update profile failed", err);
        alert("Cập nhật thất bại");
      });
  };

  if (loading) {
    return (
      <StaffLayout title="Chỉnh sửa hồ sơ">
        <div className="py-16 text-center text-slate-500">
          Đang tải dữ liệu...
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout title="Chỉnh sửa hồ sơ">
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-6 md:py-10">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-purple-50 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-purple-700">
            Chỉnh sửa hồ sơ
          </h2>
          <p className="text-center text-slate-500 text-sm mb-6">
            Cập nhật thông tin cá nhân của bạn trong hệ thống LumiSpa.
          </p>

          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="Username"
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Họ &amp; tên
              </label>
              <input
                {...register("fullName")}
                placeholder="Họ và tên"
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                {...register("phoneNumber")}
                placeholder="Số điện thoại"
                className="border border-slate-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/staff/profile")}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
}