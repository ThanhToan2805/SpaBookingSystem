import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/services?categoryId=${category.id}`}
      className="relative bg-white rounded-xl shadow-md p-6 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-indigo-500 opacity-10 rounded-xl pointer-events-none"></div>

      <h3 className="text-xl font-semibold mb-2 z-10 relative text-gray-800 group-hover:text-purple-600 transition">
        {category.name}
      </h3>
      <p className="text-gray-600 mb-4 z-10 relative line-clamp-3">{category.description}</p>
      <button className="mt-auto bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition z-10 relative font-medium">
        View Services
      </button>
    </Link>
  );
}