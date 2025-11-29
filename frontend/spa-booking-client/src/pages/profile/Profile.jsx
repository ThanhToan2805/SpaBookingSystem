import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { userApi } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    userApi.getProfile().then(setUser).catch(console.error);
  }, []);

  if (!user) return <LayoutWrapper>Loading...</LayoutWrapper>;

  return (
    <LayoutWrapper>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>
        <div className="grid gap-4">
          <div>
            <p className="text-gray-600">Username</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Full Name</p>
            <p className="font-semibold">{user.fullName || "Not set"}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number</p>
            <p className="font-semibold">{user.phoneNumber || "Not set"}</p>
          </div>
          <button
            onClick={() => navigate("/profile/edit")}
            className="mt-4 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </LayoutWrapper>
  );
}