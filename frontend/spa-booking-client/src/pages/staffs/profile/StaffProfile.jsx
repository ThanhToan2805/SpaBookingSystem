import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../../api/userApi";
import StaffLayout from "../layout/StaffLayout";

export default function StaffProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getProfile()
      .then(setUserProfile)
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  if (!userProfile) {
    return (
      <StaffLayout title="Hồ sơ cá nhân">
        <div className="py-16 text-center text-slate-500">Đang tải hồ sơ...</div>
      </StaffLayout>
    );
  }

  const initials =
    (userProfile.fullName || userProfile.username || "")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "LU";

  return (
    <StaffLayout title="Hồ sơ cá nhân">
      <div className="min-h-[70vh] bg-linear-to-br from-purple-50 via-white to-purple-100 py-6 md:py-10">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-50 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Hồ sơ nhân viên
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Quản lý thông tin tài khoản của bạn trong hệ thống LumiSpa.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/staff/profile/edit")}
                className="px-4 py-2.5 text-xs md:text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              >
                Chỉnh sửa hồ sơ
              </button>
              <button
                onClick={() => navigate("/staff/change-password")}
                className="px-4 py-2.5 text-xs md:text-sm font-medium bg-white border border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 transition"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Cột trái: avatar & overview */}
            <div className="md:col-span-1 space-y-4">
              <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {userProfile.fullName || userProfile.username}
                  </p>
                  <p className="text-xs text-purple-100 mt-1">
                    Nhân viên LumiSpa
                  </p>
                </div>
                <div className="mt-3 text-xs text-purple-100 space-y-1 text-center">
                  <p>Email: {userProfile.email}</p>
                  {userProfile.phoneNumber && (
                    <p>SĐT: {userProfile.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 text-xs text-slate-500 shadow-sm">
                <p>
                  * Thông tin hồ sơ của bạn được dùng để quản lý ca làm việc,
                  booking và liên hệ nội bộ trong hệ thống LumiSpa.
                </p>
              </div>
            </div>

            {/* Cột phải: chi tiết */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-base md:text-lg font-semibold mb-4 text-slate-900">
                  Thông tin tài khoản
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Username
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile.username}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Họ &amp; tên
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile.fullName || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {userProfile.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}