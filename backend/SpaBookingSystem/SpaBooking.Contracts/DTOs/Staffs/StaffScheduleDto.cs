using System;

namespace SpaBooking.Contracts.DTOs.Staffs
{
    public class StaffScheduleDto
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsBooked { get; set; }
    }
}