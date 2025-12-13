namespace SpaBooking.Contracts.DTOs.Users
{
    public class EligibleStaffUserDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FullName { get; set; }
    }
}