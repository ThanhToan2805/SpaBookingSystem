export default function StaffCard({ staff }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 transform transition duration-300 
      hover:-translate-y-1 hover:shadow-xl flex flex-col gap-2">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {staff.userName || "Nhân viên"}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            staff.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {staff.isAvailable ? "Đang rảnh" : "Bận"}
        </span>
      </div>

      <p className="text-gray-600 text-sm">
        {staff.position || "Chuyên viên spa"}
      </p>
    </div>
  );
}