import { useState } from "react";
import { authApi } from "../../api/authApi";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import EyeIcon from "../../components/icons/EyeIcon";
import EyeOffIcon from "../../components/icons/EyeOffIcon";

export default function ChangePassword() {
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
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleShow = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setIsError(true);
      setMsg("New password and confirm password do not match.");
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
      setMsg("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.log(err?.response);
      setIsError(true);
      setMsg(
        err?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (name, label, placeholder) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword[name] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          required
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
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
    <LayoutWrapper>
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-50">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-700 mb-2">
            Đổi Mật Khẩu
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Để bảo mật, Vui lòng sử dụng mật khẩu mạnh và độc nhất.
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
              "Nhập xác nhận mật khẩu mới"
            )}

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-purple-400"
              disabled={loading}
            >
              {loading ? "Saving..." : "Đổi mật khẩu"}
            </button>

            <p className="text-xs text-gray-400 mt-2">
              Mẹo: Sử dụng mật khẩu có ít nhất 8 ký tự gồm chữ, số và ký tự đặc biệt để đảm bảo an toàn.
            </p>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
}