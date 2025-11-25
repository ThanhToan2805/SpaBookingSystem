namespace SpaBooking.Contracts.DTOs.TimeSlots
{
    public class TimeSlotDto
    {
        public Guid Id { get; set; }
        public Guid StaffId { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsAvailable { get; set; }

        // Optional: thông tin booking nếu có
        public BookingInfoDto? Booking { get; set; }
    }

    public class BookingInfoDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public string? Note { get; set; }
        public string Status { get; set; } = null!;
    }
}