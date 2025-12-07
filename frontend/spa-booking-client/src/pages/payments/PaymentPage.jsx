import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { paymentApi } from "../../api/paymentApi";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";

function formatMoney(v) {
  if (!v) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v);
}

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN");
}

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Failed: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function PaymentPage() {
  const { paymentId } = useParams();
  const location = useLocation();
  const state = location.state || {};

  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState(state.bookingId || null);
  const [finalPrice, setFinalPrice] = useState(state.finalPrice || 0);
  const [paymentMethod, setPaymentMethod] = useState(
    state.paymentMethod || null
  );
  const [status, setStatus] = useState(null);
  const [invoiceCode, setInvoiceCode] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) return;

    // Nếu đã có state từ navigate, không bắt buộc fetch lại
    if (state.bookingId) {
      setLoading(false);
      return;
    }

    paymentApi
      .getById(paymentId)
      .then((payment) => {
        setBookingId(payment.bookingId);
        setPaymentMethod(payment.paymentMethod);
        setFinalPrice(payment.finalPrice || payment.amount || 0);
        setStatus(payment.status || null);
        setInvoiceCode(payment.invoiceCode || null);
        setCreatedAt(payment.createdAt || null);
      })
      .catch((err) => {
        console.error("Payment fetch failed:", err);
        alert("Failed to load payment info. Check Payment ID.");
      })
      .finally(() => setLoading(false));
  }, [paymentId, state.bookingId]);

  const handleConfirmCash = async () => {
    if (!paymentId) return alert("Payment ID missing!");
    setLoading(true);
    try {
      await paymentApi.confirmCash(paymentId);
      alert("Payment confirmed (Cash)");
      navigate(`/my-bookings`);
    } catch (err) {
      alert("Lỗi confirm payment (Cash): " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithVnPay = async () => {
    try {
      if (!paymentId) {
        alert("Không tìm thấy paymentId");
        return;
      }
      const res = await paymentApi.createVnPayUrl(paymentId);
      const url = res.paymentUrl || res.data?.paymentUrl;
      if (!url) {
        alert("Không tạo được link VNPay");
        return;
      }
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo link VNPay");
    }
  };

  const effectiveStatus = status || "Pending";

  const methodLabel =
    paymentMethod === "VNPay"
      ? "Thanh toán online qua VNPay"
      : paymentMethod === "Cash"
      ? "Thanh toán tiền mặt tại spa"
      : "Chưa chọn phương thức";

  return (
    <LayoutWrapper>
      <div className="min-h-[70vh] bg-linear-to-br from-purple-50 via-white to-purple-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Thanh toán đơn đặt lịch
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Kiểm tra lại thông tin thanh toán trước khi hoàn tất. LumiSpa
              sẽ gửi xác nhận sau khi thanh toán thành công.
            </p>
          </div>

          {loading ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-50 p-8 text-center text-slate-500">
              Đang tải thông tin thanh toán...
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Thông tin thanh toán */}
              <div className="md:col-span-2 bg-white/95 rounded-2xl shadow-xl border border-slate-100 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Trạng thái thanh toán
                    </p>
                    <div
                      className={
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mt-1 " +
                        (STATUS_STYLE[effectiveStatus] ||
                          "bg-slate-50 text-slate-600 border-slate-200")
                      }
                    >
                      ● {effectiveStatus}
                    </div>
                  </div>

                  {invoiceCode && (
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Mã hoá đơn
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {invoiceCode}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Mã booking</p>
                    <p className="mt-1 font-mono text-[13px] break-all text-slate-800">
                      {bookingId || "Không xác định"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Thời gian tạo</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateTime(createdAt)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 mt-2 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Số tiền cần thanh toán
                    </span>
                    <span className="text-2xl font-extrabold text-purple-700">
                      {formatMoney(finalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Phương thức thanh toán
                    </span>
                    <div className="flex items-center gap-2">
                      {paymentMethod === "Cash" && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-lg">
                          💵
                        </span>
                      )}
                      {paymentMethod === "VNPay" && (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                          VNPay
                        </span>
                      )}
                      <span className="text-sm font-medium text-slate-900">
                        {methodLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-[12px] text-slate-500">
                  🔒 Mọi giao dịch thanh toán trực tuyến được mã hoá và bảo mật.
                  LumiSpa không lưu thông tin thẻ / tài khoản ngân hàng của bạn.
                </div>
              </div>

              {/* Cột action */}
              <div className="bg-white/95 rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
                    Hành động
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chọn thao tác tương ứng với phương thức thanh toán đã chọn.
                  </p>

                  {paymentMethod === "Cash" && (
                    <>
                      <button
                        onClick={handleConfirmCash}
                        className="w-full bg-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition disabled:bg-purple-400"
                        disabled={loading}
                      >
                        {loading
                          ? "Đang xử lý..."
                          : "Xác nhận đã thanh toán tiền mặt"}
                      </button>
                      <p className="text-[11px] text-slate-500">
                        Vui lòng thanh toán trực tiếp tại quầy lễ tân. Nhân
                        viên sẽ xác nhận và hoàn tất đơn đặt lịch cho bạn.
                      </p>
                    </>
                  )}

                  {paymentMethod === "VNPay" && (
                    <>
                      <button
                        onClick={handlePayWithVnPay}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                      >
                        Thanh toán ngay qua VNPay
                      </button>
                      <p className="text-[11px] text-slate-500">
                        Bạn sẽ được chuyển tới trang thanh toán VNPay để quét
                        mã QR hoặc thanh toán bằng thẻ / ví điện tử.
                      </p>
                    </>
                  )}

                  {!paymentMethod && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      Không tìm thấy phương thức thanh toán. Vui lòng quay lại
                      bước đặt lịch và thử lại.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/my-bookings")}
                  className="mt-2 w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-medium hover:bg-slate-50 transition"
                >
                  ← Về trang lịch đã đặt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}