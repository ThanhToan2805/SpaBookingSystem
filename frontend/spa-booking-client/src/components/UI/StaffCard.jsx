export default function StaffCard({ staff }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <h3 className="text-xl font-semibold">{staff.userName || "Unknown"}</h3>
      <p className="text-gray-600">{staff.position}</p>
      <p className={`mt-1 font-medium ${staff.isAvailable ? "text-green-600" : "text-red-600"}`}>
        {staff.isAvailable ? "Available" : "Not Available"}
      </p>
    </div>
  );
}