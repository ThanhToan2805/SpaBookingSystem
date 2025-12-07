// src/pages/admin/AdminChangePassword.jsx
import { useState } from "react";
import AdminLayout from "./layout/AdminLayout";
import { authApi } from "../../api/authApi";
import EyeIcon from "../../components/icons/EyeIcon";
import EyeOffIcon from "../../components/icons/EyeOffIcon";

export default function AdminChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleShow = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setMsg("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMsg("");

      await authApi.changePassword({
        CurrentPassword: form.oldPassword,
        NewPassword: form.newPassword,
        ConfirmPassword: form.confirmPassword,
      });

      setMsg("Đổi mật khẩu thành công!");
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err?.response);
      setIsError(true);
      setMsg(
        err?.response?.data?.message ||
          "Đổi mật khẩu thất bại, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (name, label, placeholder) => (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword[name] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          required
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-slate-700 transition"
          onClick={() => toggleShow(name)}
        >
          {showPassword[name] ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Đổi mật khẩu Admin">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 p-7">
          {/* Header */}
          <div className="mb-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 text-white text-2xl font-bold mb-2">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Đổi mật khẩu quản trị
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Để bảo mật tài khoản admin, hãy sử dụng mật khẩu mạnh và không chia sẻ cho người khác.
            </p>
          </div>

          {/* Message */}
          {msg && (
            <div
              className={`mb-4 text-sm text-center px-3 py-2 rounded-lg ${
                isError
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}
            >
              {msg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {renderPasswordInput(
              "oldPassword",
              "Mật khẩu hiện tại",
              "Nhập mật khẩu hiện tại"
            )}
            {renderPasswordInput(
              "newPassword",
              "Mật khẩu mới",
              "Nhập mật khẩu mới"
            )}
            {renderPasswordInput(
              "confirmPassword",
              "Xác nhận mật khẩu mới",
              "Nhập lại mật khẩu mới"
            )}

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:bg-purple-400"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Đổi mật khẩu"}
            </button>

            <p className="text-[11px] text-slate-400 mt-2">
              Gợi ý: Sử dụng ít nhất 8 ký tự, kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
              để tăng độ mạnh của mật khẩu.
            </p>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}