import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password
      };
      await authApi.register(payload);
      alert("Registration successful! Please login.");
      navigate("/auth/signin");
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("username")} placeholder="Username" className="border p-2 rounded"/>
          <input {...register("email")} placeholder="Email" className="border p-2 rounded"/>
          <input {...register("password")} type="password" placeholder="Password" className="border p-2 rounded"/>
          <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/auth/signin" className="text-purple-600">Sign In</Link>
        </p>
      </div>
    </LayoutWrapper>
  );
}