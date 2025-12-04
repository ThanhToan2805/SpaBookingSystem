namespace SpaBooking.Domain.Entities
{
    public class Promotion
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public decimal? DiscountAmount { get; set; }  // giảm theo số tiền
        public decimal? DiscountPercent { get; set; } // giảm theo %
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}