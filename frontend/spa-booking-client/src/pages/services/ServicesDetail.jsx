import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";

export default function ServicesDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    serviceApi.getById(id).then(setService).catch(console.error);
  }, [id]);

  if (!service)
    return <LayoutWrapper>Loading...</LayoutWrapper>;

  return (
    <LayoutWrapper>
      <div className="py-12 bg-linear-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-purple-50">

          {/* Image */}
          <div className="relative">
            <img
              src={service.imageUrl || "/placeholder.png"}
              alt={service.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            <h2 className="absolute bottom-6 left-8 text-white text-4xl font-bold drop-shadow-lg">
              {service.name}
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 space-y-10">

            {/* Description */}
            <div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <p className="text-xs font-medium text-purple-600 uppercase">Giá dịch vụ</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(service.price)}
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <p className="text-xs font-medium text-purple-600 uppercase">Thời lượng</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">
                  {service.durationMinutes} phút
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <p className="text-xs font-medium text-purple-600 uppercase">Trạng thái</p>
                <p className="text-xl font-semibold text-emerald-600 mt-1">Còn phục vụ</p>
              </div>
            </div>

            {/* Why choose */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Vì sao bạn sẽ yêu thích dịch vụ này?
              </h3>
              <ul className="list-disc pl-6 text-gray-600 leading-relaxed">
                <li>Đội ngũ kỹ thuật viên chuyên nghiệp, được đào tạo bài bản.</li>
                <li>Môi trường sang trọng, thư giãn, chuẩn spa cao cấp.</li>
                <li>Đặt lịch dễ dàng, không cần chờ đợi.</li>
                <li>Dùng sản phẩm an toàn & được kiểm định.</li>
              </ul>
            </div>

            {/* Button */}
            <div className="pt-4">
              <button
                onClick={() => navigate(`/booking?serviceId=${service.id}`)}
                className="px-8 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}