import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { bookingApi } from "../../api/bookingApi";
import { paymentApi } from "../../api/paymentApi";
import BookingCard from "../../components/UI/BookingCard";
import Modal from "../../components/UI/Modal";
import { useAuth } from "../../contexts/AuthContext";
import { useBookingHub } from "../../hooks/useBookingHub";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStartAt, setNewStartAt] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // filter status
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortMode, setSortMode] = useState("NEWEST"); 

  useEffect(() => {
    if (user) reload();
  }, [user]);

  const reload = async () => {
    try {
      const all = await bookingApi.getAll();
      const my = all.filter((b) => String(b.customerId) === String(user.UserId));
      setBookings(my);
    } catch (err) {
      console.error("Lỗi load booking:", err);
    }
  };

  // map status để hiển thị dropdown thân thiện
  const statusOptions = [
    { value: "All", label: "Tất cả" },
    { value: "Pending", label: "Chờ xác nhận" },
    { value: "Confirmed", label: "Đã xác nhận" },
    { value: "Cancelled", label: "Đã hủy" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "NoShow", label: "Không đến" },
  ];

  // danh sách sau khi lọc
  const displayBookings = useMemo(() => {
  const list = statusFilter === "All"
    ? [...bookings]
    : bookings.filter((b) => b.status === statusFilter);

  const getTime = (b) => {
    // ưu tiên createdAt, fallback startAt, fallback endAt
    const t =
      b.createdAt || b.startAt || b.endAt || b.updatedAt || null;
    const ms = t ? new Date(t).getTime() : NaN;
    // fallback cuối: id (nếu id là số tăng dần)
    if (!Number.isFinite(ms)) return Number(b.id) || 0;
    return ms;
  };

  const now = Date.now();

  switch (sortMode) {
    case "OLDEST":
      return list.sort((a, c) => getTime(a) - getTime(c));

    case "UPCOMING":
      // ưu tiên lịch sắp tới gần nhất, còn quá khứ đẩy xuống
      return list.sort((a, c) => {
        const ta = new Date(a.startAt).getTime();
        const tc = new Date(c.startAt).getTime();
        const da = ta - now;
        const dc = tc - now;

        const aFuture = da >= 0;
        const cFuture = dc >= 0;

        if (aFuture && !cFuture) return -1;
        if (!aFuture && cFuture) return 1;

        // cùng tương lai: gần nhất lên đầu; cùng quá khứ: gần đây nhất lên đầu
        return aFuture ? da - dc : tc - ta;
      });

    case "RECENT_PAST":
      // ưu tiên booking quá khứ gần đây nhất (đã diễn ra) lên đầu, tương lai xuống
      return list.sort((a, c) => {
        const ta = new Date(a.startAt).getTime();
        const tc = new Date(c.startAt).getTime();
        const da = ta - now;
        const dc = tc - now;

        const aPast = da < 0;
        const cPast = dc < 0;

        if (aPast && !cPast) return -1;
        if (!aPast && cPast) return 1;

        // cùng quá khứ: gần đây nhất lên đầu; cùng tương lai: gần nhất lên đầu
        return aPast ? tc - ta : da - dc;
      });

    case "NEWEST":
    default:
      return list.sort((a, c) => getTime(c) - getTime(a));
  }
}, [bookings, statusFilter, sortMode]);

  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setNewStartAt("");
    setRescheduleModalOpen(true);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  const submitReschedule = async () => {
    if (!newStartAt) return alert("Hãy chọn thời gian!");
    const iso = new Date(newStartAt).toISOString();
    await bookingApi.reschedule(selectedBooking.id, {
      bookingId: selectedBooking.id,
      newStartAt: iso,
      staffId: selectedBooking.staffId,
    });
    setRescheduleModalOpen(false);
    await reload();
    alert("Đổi lịch thành công!");
  };

  const submitCancel = async () => {
    await bookingApi.cancelBooking(selectedBooking.id, {
      reason: cancelReason || "Khách hủy",
    });
    setCancelModalOpen(false);
    await reload();
    alert("Hủy thành công!");
  };

  const handlePay = async (booking) => {
    try {
      const payments = await paymentApi.getByBooking(booking.id);
      if (!payments || payments.length === 0) return alert("Payment not found");

      const paymentData = payments[0];

      navigate(`/payment/${paymentData.id}`, {
        state: {
          bookingId: booking.id,
          finalPrice: booking.finalPrice,
          paymentMethod: paymentData.paymentMethod,
        },
      });
    } catch (err) {
      alert("Lỗi tạo payment: " + err.message);
    }
  };

  useBookingHub(user?.UserId, {
    onCreated: (payload) => {
      if (payload.customerId && payload.customerId !== user?.UserId) return;
      reload(); // ✅ FIX: reloadBookings -> reload
    },
    onUpdated: (payload) => {
      if (payload.customerId && payload.customerId !== user?.UserId) return;
      reload();
    },
    onCancelled: (payload) => {
      if (payload.customerId && payload.customerId !== user?.UserId) return;
      reload();
    },
    onRescheduled: (payload) => {
      if (payload.customerId && payload.customerId !== user?.UserId) return;
      reload();
    },
  });

  return (
    <LayoutWrapper>
      <div className="py-8">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-gray-800 text-center">
            Lịch đặt của tôi
          </h2>
          <p className="text-center text-gray-500 mt-2 text-sm">
            Theo dõi, đổi lịch hoặc hủy các buổi hẹn tại LumiSpa.
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Left: Status filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  Trạng thái
                </span>

                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2
                            focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="NEWEST">Mới nhất</option>
                  <option value="OLDEST">Cũ nhất</option>
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="RECENT_PAST">Đã diễn ra gần đây</option>
                </select>
              </div>

              {/* Right: Count + Reset */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-xs text-gray-500">
                  Hiển thị <b className="text-gray-700">{displayBookings.length}</b> /
                  <b className="text-gray-700"> {bookings.length}</b> booking
                </span>

                <button
                  onClick={() => setStatusFilter("All")}
                  className="text-sm font-medium px-3 py-2 rounded-xl border border-gray-200
                            hover:bg-gray-50 transition"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center mt-16">
            <p className="text-gray-500 text-lg mb-4">
              Bạn chưa có booking nào.
            </p>
          </div>
        ) : displayBookings.length === 0 ? (
          <div className="flex flex-col items-center mt-16">
            <p className="text-gray-500 text-lg mb-4">
              Không có booking nào phù hợp với trạng thái đã chọn.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={{ ...b, onPay: handlePay }}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Reschedule */}
      <Modal
        open={rescheduleModalOpen}
        title="Thay đổi thời gian đặt lịch"
        onClose={() => setRescheduleModalOpen(false)}
      >
        <label className="block mb-2 font-medium text-sm text-gray-700">
          Chọn thời gian mới:
        </label>
        <input
          type="datetime-local"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={newStartAt}
          onChange={(e) => setNewStartAt(e.target.value)}
        />
        <button
          onClick={submitReschedule}
          className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
        >
          Xác nhận thay đổi
        </button>
      </Modal>

      {/* Modal Cancel */}
      <Modal
        open={cancelModalOpen}
        title="Hủy lịch hẹn"
        onClose={() => setCancelModalOpen(false)}
      >
        <label className="block mb-2 font-medium text-sm text-gray-700">
          Lý do hủy:
        </label>
        <textarea
          className="w-full border rounded-lg px-3 py-2 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do..."
        />
        <button
          onClick={submitCancel}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
        >
          Xác nhận hủy
        </button>
      </Modal>
    </LayoutWrapper>
  );
}