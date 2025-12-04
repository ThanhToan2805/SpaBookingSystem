import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import { categoryApi } from "../../api/categoryApi";
import ServiceCard from "../../components/UI/ServiceCard";
import CategoryCard from "../../components/UI/CategoryCard";

export default function Home() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    serviceApi.getAll().then(setServices).catch(console.error);
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-purple-600 to-indigo-600 text-white py-28 mb-16 rounded-b-3xl overflow-hidden shadow-lg">
        <div className="container mx-auto text-center relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to SpaBooking
          </h1>
          <p className="text-lg md:text-xl text-purple-200 mb-8 drop-shadow">
            Book your favorite spa services easily online
          </p>
          <a
            href="#services"
            className="inline-block bg-white text-purple-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition transform"
          >
            Explore Services
          </a>
        </div>
        <div className="absolute -bottom-16 left-0 w-full h-48 bg-white/10 rounded-t-full"></div>
      </section>

      {/* Categories Section */}
      <section className="mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
            Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="services" className="mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
            Popular Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.slice(0, 6).map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}