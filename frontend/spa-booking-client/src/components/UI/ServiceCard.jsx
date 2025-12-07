import { Link } from "react-router-dom";
import EyeIcon from "../icons/EyeIcon";

export default function ServiceCard({ service, bookingCount, isPopular = false }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden transform transition 
      duration-300 hover:-translate-y-1 hover:shadow-2xl group relative flex flex-col"
    >
      <div className="relative">
        <img
          src={service.imageUrl || "/placeholder.png"}
          alt={service.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {isPopular && (
          <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-medium">
            Phổ biến
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 group-hover:text-purple-600 transition">
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {service.description}
          </p>

          {typeof bookingCount === "number" && (
            <p className="text-xs font-medium text-purple-600">
              Đã được đặt {bookingCount} lượt
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="font-bold text-purple-600 text-lg">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(service.price)}
          </p>

          <Link
            to={`/services/${service.id}`}
            className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition flex items-center justify-center"
          >
            <EyeIcon className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition" />
          </Link>
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            to={`/booking?serviceId=${service.id}`}
            className="w-full text-center py-2 rounded-lg font-medium 
              bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Đặt lịch ngay
          </Link>
        </div>
      </div>
    </div>
  );
}