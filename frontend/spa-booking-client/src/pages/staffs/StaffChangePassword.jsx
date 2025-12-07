import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import StaffLayout from "./layout/StaffLayout";
import EyeIcon from "../../components/icons/EyeIcon";
import EyeOffIcon from "../../components/icons/EyeOffIcon";

export default function StaffChangePassword() {
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
  const navigate = useNavigate();

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleShow = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setMsg("Mật khẩu mới và xác nhận không trùng khớp.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      await authApi.changePassword({
        CurrentPassword: form.oldPassword,
        NewPassword: form.newPassword,
        ConfirmPassword: form.confirmPassword,
      });
      setMsg("Đổi mật khẩu thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/staff/profile");
      }, 2000);
    } catch (err) {
      console.error(err?.response);
      setIsError(true);
      setMsg(
        err?.response?.data?.message || "Đổi mật khẩu thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (name, label, placeholder) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
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
    <StaffLayout title="Đổi mật khẩu">
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-6 md:py-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-purple-50">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-700 mb-2">
            Đổi mật khẩu
          </h2>
          <p className="text-center text-slate-500 text-sm mb-6">
            Hãy sử dụng mật khẩu mạnh và duy nhất để bảo vệ tài khoản của bạn.
          </p>

          {msg && (
            <div
              className={`mb-4 text-sm text-center px-3 py-2 rounded-lg ${
                isError
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {msg}
            </div>
          )}

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
              className="w-full py-2.5 mt-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-purple-400"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Đổi mật khẩu"}
            </button>

            <p className="text-xs text-slate-400 mt-2">
              Gợi ý: dùng ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt
              để mật khẩu mạnh hơn.
            </p>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
}