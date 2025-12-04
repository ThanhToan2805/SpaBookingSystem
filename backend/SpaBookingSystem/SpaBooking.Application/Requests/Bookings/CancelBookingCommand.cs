using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;
using System;

namespace SpaBooking.Application.Requests.Bookings
{
    public class CancelBookingCommand : IRequest<bool>
    {
        public Guid BookingId { get; set; }
        public CancelBookingDto? Dto { get; set; }
    }
}