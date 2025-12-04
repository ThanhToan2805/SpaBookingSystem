namespace SpaBooking.Domain.Entities
{
    public enum BookingStatus { Pending, Confirmed, Cancelled, Completed, NoShow }

    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid CustomerId { get; set; }
        public User Customer { get; set; } = null!;

        public Guid ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        public Guid? StaffId { get; set; }          // optional: có thể chọn staff
        public Staff? Staff { get; set; }

        public Guid? PromotionId { get; set; }      // optional
        public Promotion? Promotion { get; set; }

        public decimal FinalPrice { get; set; }      // sau khi áp dụng khuyến mãi

        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }

        // Navigation
        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

    }
}