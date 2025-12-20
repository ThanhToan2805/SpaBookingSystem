import { useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { authApi } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setIsError(false);
      await authApi.forgotPassword({ email });
      setMsg("If the email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setIsError(true);
      setMsg("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] flex justify-center items-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-purple-50 space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-700">
            Quên mật khẩu
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu.
          </p>

          {msg && (
            <p
              className={`text-center text-sm px-3 py-2 rounded-lg ${
                isError
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {msg}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-purple-400"
          >
            {loading ? "Sending..." : "Gửi link reset"}
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}