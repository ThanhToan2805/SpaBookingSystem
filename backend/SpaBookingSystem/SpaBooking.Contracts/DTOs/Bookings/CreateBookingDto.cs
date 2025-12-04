namespace SpaBooking.Contracts.DTOs.Bookings
{
    public class CreateBookingDto
    {
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid? StaffId { get; set; }
        public Guid? PromotionId { get; set; }

        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public string? Note { get; set; }
    }
}