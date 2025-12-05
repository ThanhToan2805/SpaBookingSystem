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
    userApi.getProfile().then(data => {
      setUser(data);
      reset(data); // populate form
    }).catch(console.error);
  }, []);

  const onSubmit = (data) => {
    userApi.updateProfile(data)
      .then(res => {
        alert("Profile updated successfully");
        navigate("/profile"); // quay lại profile view
      })
      .catch(err => alert("Update failed: " + err.message));
  };

  if (!user) return <LayoutWrapper>Loading...</LayoutWrapper>;

  return (
    <LayoutWrapper>
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Profile</h2>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input {...register("username")} placeholder="Username" className="border p-2 rounded"/>
          <input {...register("fullName")} placeholder="Full Name" className="border p-2 rounded"/>
          <input {...register("email")} placeholder="Email" className="border p-2 rounded"/>
          <input {...register("phoneNumber")} placeholder="Phone Number" className="border p-2 rounded"/>
          <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300">
            Save Changes
          </button>
        </form>
      </div>
    </LayoutWrapper>
  );
}