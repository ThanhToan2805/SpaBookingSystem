import { useEffect, useState } from "react";
import LayoutWrapper from "../../components/Layout/LayoutWrapper";
import { bookingApi } from "../../api/bookingApi";
import BookingCard from "../../components/UI/BookingCard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingApi.getAll().then(setBookings).catch(console.error);
  }, []);

  const handleEdit = (b) => alert("Edit booking: " + b.id);
  const handleCancel = (b) => alert("Cancel booking: " + b.id);

  return (
    <LayoutWrapper>
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>
      <div className="grid gap-6">
        {bookings.length === 0 && <p>You have no bookings.</p>}
        {bookings.map(b => (
          <BookingCard key={b.id} booking={b} onEdit={handleEdit} onCancel={handleCancel} />
        ))}
      </div>
    </LayoutWrapper>
  );
}