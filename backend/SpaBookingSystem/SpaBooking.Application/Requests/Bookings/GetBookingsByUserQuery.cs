using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetBookingsByUserQuery : IRequest<List<BookingDto>>
    {
        public Guid UserId { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string? Status { get; set; } // Optional filter
    }
}