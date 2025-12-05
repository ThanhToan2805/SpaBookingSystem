import { useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { authApi } from "../../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authApi.forgotPassword({ email });
      setMsg("If the email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setMsg("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <div className="flex justify-center items-center bg-gray-50 p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
        >
          <h2 className="text-2xl font-semibold text-purple-600 text-center">
            Forgot Password
          </h2>

          {msg && <p className="text-center text-green-600">{msg}</p>}

          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}