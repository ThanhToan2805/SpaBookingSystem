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
    }
}