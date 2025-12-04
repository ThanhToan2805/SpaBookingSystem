import { Link } from "react-router-dom";
import EyeIcon from "../icons/EyeIcon";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl group relative">
      <div className="relative">
        <img
          src={service.imageUrl || "/placeholder.png"}
          alt={service.name}
          className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-medium">
          Popular
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition">
            {service.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
        </div>

        {/* Giá tiền + Icon */}
        <div className="flex items-center justify-between mt-4">
          <p className="font-bold text-purple-600 text-lg">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
          </p>

          <Link
            to={`/services/${service.id}`}
            className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition flex items-center justify-center"
          >
            <EyeIcon className="w-5 h-5 text-gray-600 hover:text-purple-600 transition" />
          </Link>
        </div>

        {/* Book Now riêng, canh giữa */}
        <div className="mt-4 flex justify-center">
          <Link
            to={`/booking?serviceId=${service.id}`}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}