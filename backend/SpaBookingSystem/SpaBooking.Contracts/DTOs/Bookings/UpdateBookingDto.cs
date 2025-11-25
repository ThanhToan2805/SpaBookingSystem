namespace SpaBooking.Contracts.DTOs.Bookings
{
    public class UpdateBookingDto
    {
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid? StaffId { get; set; }

        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public string? Note { get; set; }
        public string Status { get; set; } = string.Empty; // Pending, Confirmed, Cancelled, Completed, NoShow
    }
}