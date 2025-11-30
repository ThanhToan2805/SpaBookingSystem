using System;

namespace SpaBooking.Contracts.DTOs.Staffs
{
    public class StaffWorkingHoursDto
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public DateTime Date { get; set; }   // Ngày tính
        public double TotalHours { get; set; } // Tổng số giờ làm việc trong ngày
        public int TotalSlots { get; set; }    // Tổng số slot
        public int BookedSlots { get; set; }   // Số slot đã book
    }
}