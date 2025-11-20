namespace SpaBooking.Domain.Entities
{
    public class Staff
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }   // nếu Staff liên kết User
        public User? User { get; set; }
        public string Position { get; set; } = null!;
        public bool IsAvailable { get; set; } = true;
    }
}