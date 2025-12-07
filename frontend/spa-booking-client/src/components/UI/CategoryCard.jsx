import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/services?categoryId=${category.id}`}
      className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between 
        transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl group overflow-hidden"
    >
      {/* Gradient nền nhẹ */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-pink-500/5 to-indigo-500/10 opacity-80 pointer-events-none" />

      <div className="relative z-10 space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {category.description}
        </p>
      </div>

      <div className="relative z-10 mt-4 flex justify-center">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white 
            group-hover:bg-purple-700 transition"
        >
          Xem dịch vụ
        </button>
      </div>
    </Link>
  );
}