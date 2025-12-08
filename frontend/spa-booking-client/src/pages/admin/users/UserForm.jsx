import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { userApi } from "../../../api/userApi";

export default function UserForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "Customer", // default như BE
  });

  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim()) {
      alert("Username và Email là bắt buộc.");
      return;
    }

    if (form.password.length < 6) {
      alert("Password phải ít nhất 6 ký tự.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Payload phải đúng y chang CreateUserCommand
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      roleName: form.roleName,
    };

    try {
      setSubmitting(true);
      const res = await userApi.create(payload);
      // BE trả { userId: guid } hoặc { UserId: guid }
      console.log("User created:", res);
      alert("Tạo user thành công!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Failed to create user:", err);

      // Handler có thể throw: "Email already exists", "Username already exists", "Role not found"
      const raw =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Tạo user thất bại.";
      alert(raw);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Tạo User mới">
      <div className="max-w-xl">
        <form
          onSubmit={submit}
          className="space-y-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Username *
            </label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Tên đăng nhập"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="example@domain.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Vai trò
            </label>
            <select
              name="roleName"
              value={form.roleName}
              onChange={onChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Customer">Customer</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mật khẩu *
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Ít nhất 6 ký tự"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Xác nhận mật khẩu *
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-60"
            >
              {submitting ? "Đang tạo..." : "Tạo user"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}