namespace SpaBooking.Contracts.DTOs.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string? FullName { get; set; }
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string RoleName { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}