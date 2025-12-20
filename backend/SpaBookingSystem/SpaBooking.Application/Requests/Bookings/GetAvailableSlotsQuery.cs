using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetAvailableSlotsQuery : IRequest<List<AvailableSlotDto>>
    {
        public DateTime Date { get; set; }
        public Guid ServiceId { get; set; }
        public Guid? StaffId { get; set; }

        // cấu hình MVP
        public int StepMinutes { get; set; } = 30;   // slot cách nhau 30'
        public int OpenHour { get; set; } = 9;       // 09:00
        public int CloseHour { get; set; } = 17;     // 17:00
    }
}