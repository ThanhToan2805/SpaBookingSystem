import { useEffect, useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { serviceApi } from "../../api/serviceApi";
import { staffApi } from "../../api/staffApi";

export default function BookingCard({ booking, onReschedule, onCancel }) {
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);

  // Lấy toàn bộ service và staff
  useEffect(() => {
    serviceApi.getAll().then(setServices).catch(console.error);
    staffApi.getAll().then(setStaffs).catch(console.error);
  }, []);

  // Map status sang text + màu hiển thị thân thiện
  const statusMap = {
    Pending: { text: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800" },
    Confirmed: { text: "Đã xác nhận", className: "bg-green-100 text-green-800" },
    Cancelled: { text: "Đã hủy", className: "bg-red-100 text-red-800" },
    Completed: { text: "Hoàn thành", className: "bg-blue-100 text-blue-800" },
    NoShow: { text: "Không đến", className: "bg-gray-200 text-gray-700" },
  };

  const status = statusMap[booking.status] || { text: booking.status, className: "bg-gray-100 text-gray-800" };

  // Lấy tên + ảnh service từ services list
  const service = services.find(s => s.id === booking.serviceId);
  const serviceName = service?.name || booking.serviceId;
  const serviceImage = service?.imageUrl || null;

  // Lấy tên staff từ staffs list
  const staff = staffs.find(s => s.id === booking.staffId);
  const staffName = staff?.userName || booking.staffId;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      {/* Ảnh service */}
      {serviceImage && (
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{serviceName}</h3>

          <div className="text-gray-600 text-sm space-y-1">
            <p><span className="font-medium">Bắt đầu:</span> {new Date(booking.startAt).toLocaleString()}</p>
            <p><span className="font-medium">Kết thúc:</span> {new Date(booking.endAt).toLocaleString()}</p>
            <p><span className="font-medium">Nhân viên:</span> {staffName}</p>
            {booking.promotionName && <p><span className="font-medium">Khuyến mãi:</span> {booking.promotionName}</p>}
            {booking.note && <p><span className="font-medium">Ghi chú:</span> {booking.note}</p>}
            <p><span className="font-medium">Giá (đã áp dụng khuyến mãi):</span> {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(booking.finalPrice)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
            {status.text}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onReschedule?.(booking)}
              className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
            >
              <PencilIcon className="w-4 h-4" /> Thay đổi lịch
            </button>
            <button
              onClick={() => onCancel?.(booking)}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              <Trash2Icon className="w-4 h-4" /> Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}