using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class CreateBookingCommand : IRequest<BookingDto>
    {
        public CreateBookingDto Dto { get; set; } = null!;
    }
}