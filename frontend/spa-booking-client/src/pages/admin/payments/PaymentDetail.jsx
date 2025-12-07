import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { paymentApi } from "../../../api/paymentApi";

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

function statusBadge(status) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ";

  switch (status) {
    case "Pending":
      return (
        <span
          className={
            base + "bg-amber-50 text-amber-700 border-amber-100"
          }
        >
          ● Pending
        </span>
      );
    case "Completed":
      return (
        <span
          className={
            base + "bg-emerald-50 text-emerald-700 border-emerald-100"
          }
        >
          ● Completed
        </span>
      );
    case "Failed":
      return (
        <span
          className={
            base + "bg-rose-50 text-rose-700 border-rose-100"
          }
        >
          ● Failed
        </span>
      );
    case "Cancelled":
      return (
        <span
          className={
            base + "bg-slate-50 text-slate-600 border-slate-200"
          }
        >
          ● Cancelled
        </span>
      );
    default:
      return (
        <span
          className={
            base + "bg-slate-50 text-slate-600 border-slate-200"
          }
        >
          ● {status || "Unknown"}
        </span>
      );
  }
}

export default function PaymentDetail() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const p = await paymentApi.getById(id);
        setPayment(p);
      } catch (err) {
        console.error("Failed to load payment detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Chi tiết Payment">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 text-sm text-slate-500">
          Đang tải chi tiết payment...
        </div>
      </AdminLayout>
    );
  }

  if (!payment) {
    return (
      <AdminLayout title="Chi tiết Payment">
        <div className="bg-white rounded-2xl border border-rose-100 p-6 text-sm text-rose-500">
          Không tìm thấy payment.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chi tiết Payment">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header căn giữa */}
        <div className="flex flex-col items-center text-center gap-3 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Thông tin thanh toán
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Xem chi tiết hóa đơn, trạng thái và phương thức thanh toán.
            </p>
          </div>
        </div>

        {/* Card tổng quan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Mã hóa đơn</p>
              <p className="text-lg font-semibold text-slate-900">
                {payment.invoiceCode}
              </p>
            </div>
            <div>{statusBadge(payment.status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Số tiền</p>
              <p className="font-semibold text-emerald-700">
                {formatMoney(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Phương thức thanh toán
              </p>
              <p className="font-medium text-slate-900">
                {payment.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Thời gian tạo
              </p>
              <p className="font-medium text-slate-900">
                {formatDateTime(payment.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Thời gian thanh toán
              </p>
              <p className="font-medium text-slate-900">
                {payment.paidAt
                  ? formatDateTime(payment.paidAt)
                  : "Chưa thanh toán"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Mã giao dịch (TransactionCode)
              </p>
              <p className="font-medium text-slate-900">
                {payment.transactionCode || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Booking liên quan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Booking liên quan
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Payment này gắn với một booking cụ thể. Bạn có thể mở chi tiết booking để xem lịch đặt.
          </p>
          <Link
            to={`/admin/bookings/${payment.bookingId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
          >
            Xem chi tiết booking
            <span>→</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}