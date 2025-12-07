import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { serviceApi } from "../../api/serviceApi";
import { staffApi } from "../../api/staffApi";
import { promotionApi } from "../../api/promotionApi";
import { bookingApi } from "../../api/bookingApi";
import { paymentApi } from "../../api/paymentApi";
import { getToken, decodeToken } from "../../utils/jwt";

function formatMoney(v) {
  if (!v) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

export default function BookingsForm() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [services, setServices] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [priceInfo, setPriceInfo] = useState({
    basePrice: 0,
    discount: 0,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const watchedServiceId = watch("serviceId");
  const watchedPromotionId = watch("promotionId");
  const watchedPaymentMethod = watch("paymentMethod");

  useEffect(() => {
    serviceApi.getAll().then(setServices).catch(console.error);
    staffApi.getAll().then(setStaffs).catch(console.error);
    promotionApi
    .getAll()
    .then((res) => {
      const activePromos = (res || []).filter((p) => p.isActive);
      setPromotions(activePromos);
    })
    .catch(console.error);
  }, []);

  useEffect(() => {
    const serviceId = searchParams.get("serviceId");
    if (serviceId) setValue("serviceId", serviceId);
  }, [services, searchParams, setValue]);

  // Tính giá gốc / giảm / tổng
  useEffect(() => {
    const service = services.find((s) => s.id === watchedServiceId);
    const promotion = promotions.find((p) => p.id === watchedPromotionId);

    if (!service) {
      setFinalPrice(0);
      setPriceInfo({ basePrice: 0, discount: 0 });
      return;
    }

    let base = service.price;
    let discount = 0;

    if (promotion) {
      if (promotion.discountPercent) {
        discount = (base * promotion.discountPercent) / 100;
      } else if (promotion.discountAmount) {
        discount = promotion.discountAmount;
      }
    }

    const final = Math.max(base - discount, 0);
    setFinalPrice(final);
    setPriceInfo({ basePrice: base, discount });
  }, [watchedServiceId, watchedPromotionId, services, promotions]);

  const onSubmit = async (data) => {
    const service = services.find((s) => s.id === data.serviceId);
    if (!service) return alert("Service not found");

    const startAt = new Date(data.startAt);
    const endAt = new Date(
      startAt.getTime() + service.durationMinutes * 60000
    );

    const token = getToken();
    const decoded = decodeToken(token);
    const customerId = decoded?.UserId;
    if (!customerId) return alert("User not logged in");

    if (!data.paymentMethod) return alert("Chọn phương thức thanh toán!");

    try {
      // Tạo booking
      const booking = await bookingApi.create({
        ...data,
        customerId,
        startAt: startAt.toISOString(),
        endAt: endAt.toISOString(),
        promotionId: data.promotionId || null,
      });

      // Tạo payment
      const payment = await paymentApi.create({
        bookingId: booking.id,
        paymentMethod: data.paymentMethod,
        amount: finalPrice,
      });

      // Chuyển sang trang PaymentPage
      navigate(`/payment/${payment.id}`, {
        state: {
          bookingId: booking.id,
          finalPrice,
          paymentMethod: data.paymentMethod,
        },
      });
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };

  const selectedService = services.find((s) => s.id === watchedServiceId);
  const selectedPromotion = promotions.find((p) => p.id === watchedPromotionId);

  const selectPayment = (method) => {
    setValue("paymentMethod", method, { shouldValidate: true });
  };

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hoàn tất đặt lịch của bạn
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
              Chọn dịch vụ, thời gian và phương thức thanh toán. LumiSpa sẽ
              giữ lịch cho bạn và gửi thông tin chi tiết qua hệ thống.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Cột trái: thông tin đặt lịch + phương thức thanh toán */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
                  Thông tin dịch vụ
                </h3>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("serviceId")}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Nhân viên (tuỳ chọn)
                  </label>
                  <select
                    {...register("staffId")}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Không chọn nhân viên cụ thể</option>
                    {staffs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Khuyến mãi (tuỳ chọn)
                  </label>
                  <select
                    {...register("promotionId")}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Không áp dụng khuyến mãi</option>
                    {promotions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {selectedPromotion && (
                    <p className="mt-1 text-[11px] text-emerald-700">
                      Ưu đãi:{" "}
                      {selectedPromotion.discountPercent
                        ? `Giảm ${selectedPromotion.discountPercent}%`
                        : selectedPromotion.discountAmount
                        ? `Giảm ${formatMoney(
                            selectedPromotion.discountAmount
                          )}`
                        : ""}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    {...register("startAt")}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Ghi chú
                  </label>
                  <textarea
                    {...register("note")}
                    placeholder="Ghi chú thêm (yêu cầu đặc biệt, tình trạng da, lưu ý sức khoẻ, v.v.)"
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
                  Phương thức thanh toán
                </h3>
                <p className="text-xs text-slate-500">
                  Chọn cách thanh toán mà bạn cảm thấy tiện nhất. Bạn vẫn sẽ
                  nhận được hoá đơn đầy đủ sau khi thanh toán.
                </p>

                {/* Hidden field để react-hook-form giữ paymentMethod */}
                <input type="hidden" {...register("paymentMethod")} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => selectPayment("Cash")}
                    className={`text-left flex items-center gap-3 p-3 rounded-xl border text-sm transition shadow-sm
                      ${
                        watchedPaymentMethod === "Cash"
                          ? "border-purple-500 bg-purple-50/80 ring-1 ring-purple-300"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                      💵
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Thanh toán tiền mặt
                      </div>
                      <div className="text-xs text-slate-500">
                        Thanh toán trực tiếp tại quầy lễ tân LumiSpa.
                      </div>
                    </div>
                  </button>

                  {/* VNPay */}
                  <button
                    type="button"
                    onClick={() => selectPayment("VNPay")}
                    className={`text-left flex items-center gap-3 p-3 rounded-xl border text-sm transition shadow-sm
                      ${
                        watchedPaymentMethod === "VNPay"
                          ? "border-purple-500 bg-purple-50/80 ring-1 ring-purple-300"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      VNPay
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        Thanh toán qua VNPay
                      </div>
                      <div className="text-xs text-slate-500">
                        Quét mã / chuyển khoản online nhanh chóng, bảo mật.
                      </div>
                    </div>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2">
                  Lưu ý: Một số khuyến mãi chỉ áp dụng cho thanh toán online
                  qua VNPay tuỳ từng chương trình.
                </p>
              </div>
            </div>

            {/* Cột phải: tóm tắt giá */}
            <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
                  Tóm tắt đơn đặt lịch
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dịch vụ</span>
                    <span className="font-medium text-right text-slate-800">
                      {selectedService?.name || "Chưa chọn"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Giá gốc</span>
                    <span className="font-medium">
                      {formatMoney(priceInfo.basePrice)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Khuyến mãi</span>
                    <span
                      className={
                        priceInfo.discount
                          ? "font-medium text-emerald-600"
                          : "text-slate-400"
                      }
                    >
                      {priceInfo.discount
                        ? "- " + formatMoney(priceInfo.discount)
                        : "Không áp dụng"}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-800">
                      Tổng thanh toán
                    </span>
                    <span className="text-xl font-extrabold text-purple-700">
                      {formatMoney(finalPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                  💡 Bạn có thể xem lại / hủy lịch trong mục{" "}
                  <span className="font-semibold">“Lịch đã đặt”</span> sau khi
                  hoàn tất đặt lịch.
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:bg-purple-400"
              >
                Xác nhận đặt lịch
              </button>
              <p className="mt-2 text-[11px] text-center text-slate-400">
                Bằng việc tiếp tục, bạn đồng ý với{" "}
                <span className="underline">Điều khoản sử dụng</span> và{" "}
                <span className="underline">Chính sách bảo mật</span> của
                LumiSpa.
              </p>
            </div>
          </form>
        </div>
      </div>
    </LayoutWrapper>
  );
}