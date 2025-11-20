namespace SpaBooking.Domain.Entities
{
    public enum BookingStatus { Pending, Confirmed, Cancelled, Completed }

    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }   // liên kết User (khách)
        public User? Customer { get; set; }
        public Guid ServiceId { get; set; }
        public Service? Service { get; set; }
        public Guid? StaffId { get; set; }     // optional: có thể chọn staff
        public Staff? Staff { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
    }
}