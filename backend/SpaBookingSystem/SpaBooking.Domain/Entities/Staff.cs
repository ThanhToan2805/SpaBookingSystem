namespace SpaBooking.Domain.Entities
{
    public class Staff
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }          // required
        public User User { get; set; } = null!;   // 1-1 User

        public string Position { get; set; } = null!;
        public bool IsAvailable { get; set; } = true;

        // Navigation
        public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}