import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { bookingApi } from "../../../api/bookingApi";
import { userApi } from "../../../api/userApi";
import { staffApi } from "../../../api/staffApi";
import { serviceApi } from "../../../api/serviceApi";
import { promotionApi } from "../../../api/promotionApi";

const STATUS_OPTIONS_STYLE = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  NoShow: "bg-slate-50 text-slate-600 border-slate-200",
};

function statusBadge(status) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ";
  const cls =
    STATUS_OPTIONS_STYLE[status] || "bg-slate-50 text-slate-600 border-slate-200";

  return <span className={base + cls}>● {status || "Unknown"}</span>;
}

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN");
}

function formatMoney(v) {
  if (v == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

export default function BookingDetail() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [users, setUsers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [services, setServices] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);

        // 1. Lấy booking trước
        const b = await bookingApi.getById(id);
        setBooking(b);

        // 2. Lấy metadata (dạng list) để map Id → tên
        const [userRes, staffRes, serviceRes, promoRes] = await Promise.all([
          userApi.getAll(),
          staffApi.getAll(),
          serviceApi.getAll(),
          promotionApi.getAll(),
        ]);

        setUsers(userRes || []);
        setStaffs(staffRes || []);
        setServices(serviceRes || []);
        setPromotions(promoRes || []);
      } catch (err) {
        console.error("Failed to load booking detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  // Map nhanh Id → entity
  const customer = useMemo(
    () => users.find((u) => u.id === booking?.customerId),
    [users, booking]
  );

  const service = useMemo(
    () => services.find((s) => s.id === booking?.serviceId),
    [services, booking]
  );

  const staff = useMemo(
    () =>
      booking?.staffId
        ? staffs.find((s) => s.id === booking.staffId)
        : null,
    [staffs, booking]
  );

  const promotion = useMemo(
    () =>
      booking?.promotionId
        ? promotions.find((p) => p.id === booking.promotionId)
        : null,
    [promotions, booking]
  );

  if (loading) {
    return (
      <AdminLayout title="Chi tiết Booking">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-sm text-slate-500">
          Đang tải chi tiết booking...
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout title="Chi tiết Booking">
        <div className="bg-white rounded-2xl border border-rose-100 p-6 text-sm text-rose-500">
          Không tìm thấy booking.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chi tiết Booking">
      <div className="max-w-4xl mx-auto">
        {/* Card tổng quan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                Thông tin booking
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                Xem chi tiết lịch đặt, khách hàng, dịch vụ và ghi chú đi kèm.
                </p>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Khách hàng */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Khách hàng
              </h3>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                {customer ? (
                  <>
                    <div className="text-sm font-semibold text-slate-900">
                      {customer.username}
                    </div>
                    {customer.fullName && (
                      <div className="text-xs text-slate-600">
                        Họ tên: {customer.fullName}
                      </div>
                    )}
                    {customer.email && (
                      <div className="text-xs text-slate-600">
                        Email: {customer.email}
                      </div>
                    )}
                    {customer.phoneNumber && (
                      <div className="text-xs text-slate-600">
                        SĐT: {customer.phoneNumber}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-500">
                    Không tìm thấy thông tin khách hàng tương ứng.
                  </div>
                )}
              </div>
            </div>

            {/* Dịch vụ & Staff */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Dịch vụ
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  {service ? (
                    <>
                      <div className="text-sm font-semibold text-slate-900">
                        {service.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        Giá gốc (tham khảo):{" "}
                        {formatMoney(service.price)}
                      </div>
                      {service.durationMinutes && (
                        <div className="text-xs text-slate-600">
                          Thời lượng: {service.durationMinutes} phút
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Không tìm thấy thông tin dịch vụ tương ứng.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Nhân viên phụ trách
                </h3>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-1">
                  {staff ? (
                    <>
                      <div className="text-sm font-semibold text-slate-900">
                        {staff.userName}
                      </div>
                      {staff.position && (
                        <div className="text-xs text-slate-600">
                          Vị trí: {staff.position}
                        </div>
                      )}
                      <div className="text-xs text-slate-600">
                        Trạng thái:{" "}
                        {staff.isAvailable
                          ? "Đang nhận khách"
                          : "Không nhận khách"}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Chưa gán nhân viên cho booking này.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin thời gian & giá tiền */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Thời gian & thanh toán
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Thời gian bắt đầu
              </p>
              <p className="font-medium text-slate-900">
                {formatDateTime(booking.startAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Thời gian kết thúc
              </p>
              <p className="font-medium text-slate-900">
                {formatDateTime(booking.endAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Thời gian tạo booking
              </p>
              <p className="font-medium text-slate-900">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Giá sau khuyến mãi
              </p>
              <p className="font-semibold text-emerald-700">
                {formatMoney(booking.finalPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Khuyến mãi áp dụng
              </p>
              {promotion ? (
                <div className="space-y-1">
                  <p className="font-medium text-slate-900">
                    {promotion.name}
                  </p>
                  {promotion.discountPercent != null && (
                    <p className="text-xs text-slate-600">
                      Giảm {promotion.discountPercent}% trên giá dịch vụ.
                    </p>
                  )}
                  {promotion.discountAmount != null && (
                    <p className="text-xs text-slate-600">
                      Hoặc giảm trực tiếp:{" "}
                      {formatMoney(promotion.discountAmount)}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Hiệu lực: {formatDateTime(promotion.startAt)} →{" "}
                    {formatDateTime(promotion.endAt)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Không áp dụng khuyến mãi.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ghi chú & status text */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Ghi chú & trạng thái
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Ghi chú của booking
              </p>
              <p className="min-h-10 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-slate-700">
                {booking.note?.trim()
                  ? booking.note
                  : "Không có ghi chú nào cho booking này."}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Trạng thái hiện tại
              </p>
              {statusBadge(booking.status)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}