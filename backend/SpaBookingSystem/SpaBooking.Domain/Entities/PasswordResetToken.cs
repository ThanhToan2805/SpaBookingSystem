using System.ComponentModel.DataAnnotations.Schema;

namespace SpaBooking.Domain.Entities
{
    public class PasswordResetToken
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // Liên kết tới User
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public string Token { get; set; } = null!;
        public DateTime Expiration { get; set; }

        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}