namespace SpaBooking.Domain.Entities
{
    public class TimeSlot
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid StaffId { get; set; }
        public Staff Staff { get; set; } = null!;

        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public bool IsAvailable { get; set; } = true;

        // Optional: link tới booking nếu slot đã được dùng
        public Guid? BookingId { get; set; }
        public Booking? Booking { get; set; }
    }
}