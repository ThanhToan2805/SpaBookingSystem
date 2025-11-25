namespace SpaBooking.Contracts.DTOs.Bookings
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid? StaffId { get; set; }

        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}