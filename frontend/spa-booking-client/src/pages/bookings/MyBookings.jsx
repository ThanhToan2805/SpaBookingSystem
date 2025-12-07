import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { bookingApi } from "../../api/bookingApi";
import { paymentApi } from "../../api/paymentApi";
import BookingCard from "../../components/UI/BookingCard";
import Modal from "../../components/UI/Modal";
import { useAuth } from "../../contexts/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStartAt, setNewStartAt] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (user) reload();
  }, [user]);

  const reload = async () => {
    try {
      const all = await bookingApi.getAll();
      const my = all.filter(
        (b) => String(b.customerId) === String(user.UserId)
      );
      setBookings(my);
    } catch (err) {
      console.error("Lỗi load booking:", err);
    }
  };

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
      // Lấy payment theo booking
      const payments = await paymentApi.getByBooking(booking.id);
      console.log("Payments fetched:", payments);

      if (!payments || payments.length === 0) {
        return alert("Payment not found");
      }

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

  return (
    <LayoutWrapper>
      <div className="py-8">
        <h2 className="text-4xl font-bold mb-2 text-gray-800 text-center">
          Lịch đặt của tôi
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Theo dõi, đổi lịch hoặc hủy các buổi hẹn tại LumiSpa.
        </p>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center mt-16">
            <p className="text-gray-500 text-lg mb-4">
              Bạn chưa có booking nào.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
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