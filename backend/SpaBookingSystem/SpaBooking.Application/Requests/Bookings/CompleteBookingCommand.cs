using MediatR;

namespace SpaBooking.Application.Requests.Bookings
{
    public class CompleteBookingCommand : IRequest<bool>
    {
        public Guid BookingId { get; set; }
        public string? Note { get; set; }
    }
}