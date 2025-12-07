import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { paymentApi } from "../../api/paymentApi";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

export default function VnPayReturnPage() {
  const location = useLocation();
  const [status, setStatus] = useState("processing");
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlStatus = params.get("status");
    const paymentId = params.get("paymentId");

    if (urlStatus) {
      setStatus(urlStatus);
    } else {
      setStatus("unknown");
    }

    if (paymentId) {
      paymentApi
        .getById(paymentId)
        .then((data) => setPayment(data))
        .catch((err) => console.error(err));
    }
  }, [location.search]);

  const renderStatus = () => {
    if (status === "processing")
      return "Đang kiểm tra kết quả thanh toán...";
    if (status === "success") return "Thanh toán VNPay THÀNH CÔNG 🎉";
    if (status === "failed") return "Thanh toán VNPay KHÔNG THÀNH CÔNG ❌";
    if (status === "invalid")
      return "Giao dịch không hợp lệ (sai chữ ký).";
    if (status === "invalid_amount")
      return "Số tiền không khớp. Vui lòng liên hệ spa.";
    if (status === "notfound")
      return "Không tìm thấy giao dịch thanh toán.";
    return "Không xác định được trạng thái thanh toán.";
  };

  const statusColor =
    status === "success"
      ? "text-emerald-600"
      : status === "failed" || status === "invalid" || status === "invalid_amount"
      ? "text-red-600"
      : "text-gray-700";

  return (
    <LayoutWrapper>
      <div className="min-h-[60vh] flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-50 space-y-4">
          <h1 className="text-2xl font-semibold text-center mb-2 text-purple-700">
            Kết quả thanh toán VNPay
          </h1>
          <p className={`text-center text-lg font-medium ${statusColor}`}>
            {renderStatus()}
          </p>

          {payment && (
            <div className="mt-4 border-t pt-4 text-sm space-y-1 text-gray-700">
              <p>
                <span className="font-semibold">Mã hóa đơn:</span>{" "}
                {payment.invoiceCode}
              </p>
              <p>
                <span className="font-semibold">Số tiền:</span>{" "}
                {payment.amount?.toLocaleString()} VND
              </p>
              <p>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {payment.status}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/my-bookings"
              className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              Xem lịch đặt của tôi
            </Link>
            <Link
              to="/"
              className="border border-gray-400 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 text-sm font-medium"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}