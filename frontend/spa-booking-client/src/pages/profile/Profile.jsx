import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getProfile().then(setUser).catch(console.error);
  }, []);

  if (!user)
    return <LayoutWrapper>Loading...</LayoutWrapper>;

  const initials =
    (user.fullName || user.username || "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "LU";

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-50 p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            Hồ sơ tài khoản
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Cột trái: avatar + tổng quan */}
            <div className="md:col-span-1">
              <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-xs text-purple-100 mt-1">
                    Thành viên LumiSpa
                  </p>
                </div>
                <div className="mt-3 text-xs text-purple-100 space-y-1 text-center">
                  <p>Email: {user.email}</p>
                  {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                >
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  onClick={() => navigate("/auth/change-password")}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 transition"
                >
                  Đổi mật khẩu
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                >
                  Xem lịch đã đặt
                </button>
              </div>
            </div>

            {/* Cột phải: chi tiết */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Thông tin cá nhân
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Username
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Full Name
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.fullName || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Phone Number
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-xs text-gray-400">
                  * Thông tin này chỉ được sử dụng để hỗ trợ đặt lịch và chăm
                  sóc khách hàng tại LumiSpa.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}