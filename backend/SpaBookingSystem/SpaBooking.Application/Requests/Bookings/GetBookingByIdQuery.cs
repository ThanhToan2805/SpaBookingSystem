using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetBookingByIdQuery : IRequest<BookingDto?>
    {
        public Guid Id { get; set; }
    }
}