import { useEffect, useState } from "react";
import AdminLayout from "./layout/AdminLayout";
import { userApi } from "../../api/userApi";
import { Link } from "react-router-dom";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    roleName: "",
    createdAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await userApi.getProfile();
      setProfile({
        username: res.username || "",
        fullName: res.fullName || "",
        email: res.email || "",
        phoneNumber: res.phoneNumber || "",
        roleName: res.roleName || "",
        createdAt: res.createdAt || null,
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
      alert("Không tải được thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await userApi.updateProfile({
        username: profile.username.trim(),
        fullName: profile.fullName.trim() || null,
        email: profile.email.trim(),
        phoneNumber: profile.phoneNumber.trim() || null,
      });
      alert("Cập nhật hồ sơ thành công!");
      loadProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleString("vi-VN");
  };

  const avatarChar = (profile.username || "A").charAt(0).toUpperCase();

  return (
    <AdminLayout title="Hồ sơ Admin">
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-sm text-slate-500">
          Đang tải hồ sơ...
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {avatarChar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Hồ sơ quản trị viên
                </h2>
                <p className="text-sm text-slate-500">
                  Xem và cập nhật thông tin tài khoản admin cho khu vực quản trị LumiSpa.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/change-password"
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Đổi mật khẩu
              </Link>
            </div>
          </div>

          {/* Grid 2 cột: card info + form chỉnh sửa */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cột trái: card thông tin tổng quan */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-semibold">
                    {avatarChar}
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">
                      Đang đăng nhập với vai trò
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {profile.username || "Admin"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vai trò</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
                      {profile.roleName || "Admin"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Ngày tạo</span>
                    <span className="text-slate-800 font-medium">
                      {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                  Thông tin hồ sơ được sử dụng để hiển thị trong hệ thống đặt lịch
                  và khu vực quản trị LumiSpa.
                </div>
              </div>
            </div>

            {/* Cột phải: form cập nhật */}
            <div className="lg:col-span-2">
              <form
                onSubmit={onSubmit}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
              >
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">
                  Thông tin tài khoản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      value={profile.username}
                      onChange={onChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tên đăng nhập"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Họ và tên
                    </label>
                    <input
                      name="fullName"
                      value={profile.fullName}
                      onChange={onChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nhập họ tên (tuỳ chọn)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={onChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="example@domain.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={onChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nhập số điện thoại (tuỳ chọn)"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={loadProfile}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    disabled={saving}
                  >
                    Hoàn nguyên
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 disabled:opacity-60 transition"
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}