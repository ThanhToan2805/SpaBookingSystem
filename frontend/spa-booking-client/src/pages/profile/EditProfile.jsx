import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { register, handleSubmit, reset } = useForm();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userApi
      .getProfile()
      .then((data) => {
        setUser(data);
        reset(data); // populate form
      })
      .catch(console.error);
  }, [reset]);

  const onSubmit = (data) => {
    userApi
      .updateProfile(data)
      .then(() => {
        alert("Profile updated successfully");
        navigate("/profile"); // quay lại profile view
      })
      .catch((err) => alert("Update failed: " + err.message));
  };

  if (!user)
    return <LayoutWrapper>Loading...</LayoutWrapper>;

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-xl rounded-2xl border border-purple-50 p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-purple-700">
            Chỉnh sửa hồ sơ
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Cập nhật thông tin cá nhân để LumiSpa phục vụ bạn tốt hơn.
          </p>

          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="Username"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                {...register("phoneNumber")}
                placeholder="Phone Number"
                className="border border-gray-300 p-2.5 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
}