using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetAllBookingsQuery : IRequest<IEnumerable<BookingDto>> { }
}