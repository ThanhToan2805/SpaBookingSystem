import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { bookingApi } from "../../api/bookingApi";
import BookingCard from "../../components/UI/BookingCard";
import Modal from "../../components/UI/Modal";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  // Modal state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Data for modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStartAt, setNewStartAt] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    const data = await bookingApi.getAll();
    setBookings(data);
  };

  // Mở modal reschedule
  const handleReschedule = (booking) => {
    setSelectedBooking(booking);
    setNewStartAt(""); 
    setRescheduleModalOpen(true);
  };

  // Mở modal hủy
  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setCancelModalOpen(true);
  };

  // Submit reschedule
  const submitReschedule = async () => {
    try {
      if (!newStartAt) return alert("Hãy chọn thời gian!");

      const iso = new Date(newStartAt).toISOString();

      await bookingApi.reschedule(selectedBooking.id, {
        bookingId: selectedBooking.id,
        newStartAt: iso,
        staffId: selectedBooking.staffId
      });

      setRescheduleModalOpen(false);
      await reload();
      alert("Đổi lịch thành công!");
    } catch (err) {
      alert("Lỗi đổi lịch: " + err.message);
    }
  };

  // Submit cancel
  const submitCancel = async () => {
    try {
      await bookingApi.cancelBooking(selectedBooking.id, {
        reason: cancelReason || "Khách hủy"
      });

      setCancelModalOpen(false);
      await reload();
      alert("Hủy thành công!");
    } catch (err) {
      alert("Lỗi hủy: " + err.message);
    }
  };

  return (
    <LayoutWrapper>
      <h2 className="text-4xl font-bold mb-8 text-gray-800">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <p className="text-gray-500 text-lg mb-4">Bạn chưa có booking nào.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map(b => (
            <BookingCard
              key={b.id}
              booking={b}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* ---------------- MODAL RESCHEDULE ---------------- */}
      <Modal
        open={rescheduleModalOpen}
        title="Thay đổi thời gian đặt lịch"
        onClose={() => setRescheduleModalOpen(false)}
      >
        <label className="block mb-2 font-medium">Chọn thời gian mới:</label>

        <input
          type="datetime-local"
          className="w-full border rounded-lg px-3 py-2"
          value={newStartAt}
          onChange={(e) => setNewStartAt(e.target.value)}
        />

        <button
          onClick={submitReschedule}
          className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Xác nhận thay đổi
        </button>
      </Modal>

      {/* ---------------- MODAL CANCEL ---------------- */}
      <Modal
        open={cancelModalOpen}
        title="Hủy lịch hẹn"
        onClose={() => setCancelModalOpen(false)}
      >
        <label className="block mb-2 font-medium">Lý do hủy:</label>

        <textarea
          className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Nhập lý do..."
        />

        <button
          onClick={submitCancel}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Xác nhận hủy
        </button>
      </Modal>
    </LayoutWrapper>
  );
}