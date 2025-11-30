using System;

namespace SpaBooking.Contracts.DTOs.Staffs
{
    public class StaffUtilizationDto
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public int TotalSlots { get; set; }
        public int BookedSlots { get; set; }
        public double UtilizationPercent { get; set; } // 0 - 100%
    }
}