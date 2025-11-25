using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class UpdateBookingCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public UpdateBookingDto Dto { get; set; } = null!;
    }
}