using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Requests.Bookings
{
    public record ConfirmBookingCommand(Guid BookingId) : IRequest<BookingDto>;
}