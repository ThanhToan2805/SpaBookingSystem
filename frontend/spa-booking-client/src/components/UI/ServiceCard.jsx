import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl group relative"
    >
      <div className="relative">
        <img
          src={service.imageUrl || "/placeholder.png"}
          alt={service.name}
          className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-md font-medium">
          Popular
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition">
          {service.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-purple-600 text-lg">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
          </p>
          <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition font-medium">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
}