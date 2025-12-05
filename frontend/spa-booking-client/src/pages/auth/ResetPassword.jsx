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
        confirmPassword: form.confirmPassword
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
        <div className="text-center text-red-600 p-6 text-lg font-medium">
          Invalid password reset link.
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="flex justify-center items-center bg-gray-50 p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
        >
          <h2 className="text-2xl font-semibold text-purple-600 text-center">
            Reset Password
          </h2>

          {/* Messages */}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center font-medium">{success}</p>
          )}

          {/* Inputs */}
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            placeholder="New Password"
            className={`w-full border px-3 py-2 rounded ${
              error ? "border-red-400" : "border-gray-300"
            }`}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm New Password"
            className={`w-full border px-3 py-2 rounded ${
              error ? "border-red-400" : "border-gray-300"
            }`}
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:bg-purple-400"
          >
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}