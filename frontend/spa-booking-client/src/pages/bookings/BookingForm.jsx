import { useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import { staffApi } from "../../api/staffApi";
import { promotionApi } from "../../api/promotionApi";
import { bookingApi } from "../../api/bookingApi";
import { getToken, decodeToken } from "../../utils/jwt";

export default function BookingForm() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  const [searchParams] = useSearchParams();

  const watchedServiceId = watch("serviceId");
  const watchedPromotionId = watch("promotionId");

  useEffect(() => {
    serviceApi.getAll().then(setServices);
    staffApi.getAll().then(setStaffs);
    promotionApi.getAll().then(setPromotions);
  }, []);

  useEffect(() => {
    // Nếu có query param serviceId, set sẵn
    const serviceId = searchParams.get("serviceId");
    if (serviceId) {
      setValue("serviceId", serviceId);
      const svc = services.find(s => s.id === serviceId);
      setSelectedService(svc);
      if (svc) setFinalPrice(svc.price);
    }
  }, [services, searchParams, setValue]);

  useEffect(() => {
    // Khi service hoặc promotion thay đổi, cập nhật finalPrice
    const service = services.find(s => s.id === watchedServiceId);
    const promotion = promotions.find(p => p.id === watchedPromotionId);

    if (service) {
      let price = service.price;
      if (promotion) {
        if (promotion.discountPercent) {
          price = price * (1 - promotion.discountPercent / 100);
        } else if (promotion.discountAmount) {
          price = price - promotion.discountAmount;
        }
      }
      setFinalPrice(Math.max(price, 0));
    } else {
      setFinalPrice(0);
    }
  }, [watchedServiceId, watchedPromotionId, services, promotions]);

  const onSubmit = (data) => {
    const service = services.find(s => s.id === data.serviceId);
    if (!service) return alert("Service not found");

    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt.getTime() + service.durationMinutes * 60000);

    const token = getToken();
    const decoded = decodeToken(token);
    console.log(decoded);
    const customerId = decoded.UserId;

    if (!customerId) return alert("User not logged in or invalid token");

    const payload = {
      ...data,
      customerId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      promotionId: data.promotionId || null // ép null nếu rỗng
    };

    console.log("Booking payload:", payload);

    bookingApi.create(payload)
      .then(() => alert("Booking created successfully"))
      .catch(err => alert("Booking failed: " + err.message));
  };

  return (
    <LayoutWrapper>
      <h2 className="text-3xl font-bold mb-6">Book a Service</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-lg mx-auto">
        <select {...register("serviceId")} className="border p-2 rounded">
          <option value="">Select Service</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select {...register("staffId")} className="border p-2 rounded">
          <option value="">Select Staff (optional)</option>
          {staffs.map(s => <option key={s.id} value={s.id}>{s.userName}</option>)}
        </select>

        <select {...register("promotionId")} className="border p-2 rounded">
          <option value="">Select Promotion (optional)</option>
          {promotions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <label>
          Start Date & Time
          <input type="datetime-local" {...register("startAt")} className="border p-2 rounded w-full"/>
        </label>

        <textarea {...register("note")} placeholder="Notes" className="border p-2 rounded"/>

        {/* Hiển thị giá cuối */}
        <p className="font-bold text-purple-600 text-lg">
          Final Price: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
        </p>

        <button type="submit" className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
          Book Now
        </button>
      </form>
    </LayoutWrapper>
  );
}