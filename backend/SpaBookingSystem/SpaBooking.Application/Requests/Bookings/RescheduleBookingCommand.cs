using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class RescheduleBookingCommand : IRequest<BookingDto>
    {
        public Guid BookingId { get; set; }
        public DateTime NewStartAt { get; set; }
        public Guid? StaffId { get; set; }
    }
}