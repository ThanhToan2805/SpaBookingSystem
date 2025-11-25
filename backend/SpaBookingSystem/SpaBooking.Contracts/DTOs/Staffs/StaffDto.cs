using System;

namespace SpaBooking.Contracts.DTOs.Staffs
{
    public class StaffDto
    {
        public Guid Id { get; set; }
        public string Position { get; set; } = null!;
        public bool IsAvailable { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
    }
}