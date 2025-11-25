using MediatR;

namespace SpaBooking.Application.Requests.Bookings
{
    public class DeleteBookingCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}