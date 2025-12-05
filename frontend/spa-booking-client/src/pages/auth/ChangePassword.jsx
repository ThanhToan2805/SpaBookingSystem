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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleShow = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMsg("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        CurrentPassword: form.oldPassword,
        NewPassword: form.newPassword,
        ConfirmPassword: form.confirmPassword,
      });
      setMsg("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: ""});
    } catch (err) {
       console.log(err.response);
      setMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (name, placeholder) => (
    <div className="relative">
      <input
        type={showPassword[name] ? "text" : "password"}
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded pr-10"
        required
      />
      <div
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
        onClick={() => toggleShow(name)}
      >
        {showPassword[name] ? <EyeOffIcon className="w-5 h-5 text-gray-500" /> : <EyeIcon className="w-5 h-5 text-gray-500" />}
      </div>
    </div>
  );

  return (
    <LayoutWrapper>
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <form 
          onSubmit={onSubmit} 
          className="w-full max-w-md bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-2xl font-semibold text-purple-600 text-center">Change Password</h2>
          {msg && <p className="text-red-500 text-center">{msg}</p>}
          {renderPasswordInput("oldPassword", "Current Password")}
          {renderPasswordInput("newPassword", "New Password")}
          {renderPasswordInput("confirmPassword", "Confirm New Password")}
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}