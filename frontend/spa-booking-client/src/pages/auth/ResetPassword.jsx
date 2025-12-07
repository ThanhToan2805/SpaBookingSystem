import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { authApi } from "../../api/authApi";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setSuccess("Password reset successfully!");
      setForm({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError("Invalid or expired reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <LayoutWrapper>
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white px-6 py-4 rounded-xl shadow border border-red-100 text-red-600 text-lg font-medium">
            Invalid password reset link.
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] flex justify-center items-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-50 space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-700">
            Reset Password
          </h2>

          {error && (
            <p className="text-red-600 text-center font-medium text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center font-medium text-sm bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
              {success}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              placeholder="New Password"
              className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                error ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm New Password"
              className={`w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                error ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-purple-400"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}