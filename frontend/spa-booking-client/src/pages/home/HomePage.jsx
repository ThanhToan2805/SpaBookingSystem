import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { Link } from "react-router-dom";
import { serviceApi } from "../../api/serviceApi";
import { categoryApi } from "../../api/categoryApi";
import { bookingApi } from "../../api/bookingApi";
import ServiceCard from "../../components/UI/ServiceCard";
import CategoryCard from "../../components/UI/CategoryCard";

export default function Home() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, categoriesRes, bookingsRes] = await Promise.all([
          serviceApi.getAll(),
          categoryApi.getAll(),
          bookingApi.getAll(), // lấy toàn bộ booking
        ]);

        const servicesData = servicesRes || [];
        const categoriesData = categoriesRes || [];
        const bookingsData = bookingsRes || [];

        setServices(servicesData);
        setCategories(categoriesData);

        // Đếm số booking theo serviceId (bỏ qua Cancelled)
        const bookingCountMap = {};
        bookingsData.forEach((b) => {
          if (!b.serviceId) return;
          if (b.status === "Cancelled") return;
          bookingCountMap[b.serviceId] =
            (bookingCountMap[b.serviceId] || 0) + 1;
        });

        // Gắn bookingCount vào service, filter active, sort desc, lấy top 6
        const popular = servicesData
          .map((s) => ({
            ...s,
            bookingCount: bookingCountMap[s.id] || 0,
          }))
          .filter((s) => s.isActive !== false) // nếu BE không set thì coi như active
          .sort((a, b) => b.bookingCount - a.bookingCount)
          .slice(0, 6);

        setPopularServices(popular);
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };

    loadData();
  }, []);

  // Nếu chưa tính được popular (vd: chưa có booking), fallback về services.slice(0,6)
  const servicesToShow =
    popularServices.length > 0 ? popularServices : services.slice(0, 6);

  return (
    <LayoutWrapper>
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-purple-600 to-indigo-600 text-white py-24 mb-16 rounded-b-3xl overflow-hidden shadow-lg">
        <div className="container mx-auto text-center relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            LumiSpa – Relax, Renew, Rejuvenate
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-8 drop-shadow">
            Đặt lịch spa, chăm sóc da, massage dễ dàng chỉ trong vài bước.
          </p>
          <a
            href="#services"
            className="inline-block bg-white text-purple-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition transform"
          >
            Khám phá dịch vụ
          </a>
        </div>
        <div className="absolute -bottom-16 left-0 w-full h-48 bg-white/10 rounded-t-full" />
      </section>

      {/* Categories Section */}
      <section className="mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-800">
            Danh mục nổi bật
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Chọn nhanh nhóm dịch vụ phù hợp nhu cầu của bạn.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="inline-block bg-purple-600 text-white py-3 px-6 rounded-full font-medium hover:bg-purple-700 transition shadow"
            >
              Xem tất cả danh mục
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section id="services" className="mb-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-gray-800">
            Dịch vụ phổ biến
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Những dịch vụ được khách hàng yêu thích và đặt nhiều nhất.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {servicesToShow.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                bookingCount={s.bookingCount}
                isPopular
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/services"
              className="inline-block bg-purple-600 text-white py-3 px-6 rounded-full font-medium hover:bg-purple-700 transition shadow"
            >
              Xem tất cả dịch vụ
            </Link>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}