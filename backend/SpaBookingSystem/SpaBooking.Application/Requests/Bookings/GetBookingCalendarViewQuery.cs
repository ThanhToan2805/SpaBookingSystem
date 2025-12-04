using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetBookingCalendarViewQuery : IRequest<List<BookingDto>>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid? StaffId { get; set; }       // lọc theo staff
        public Guid? ServiceId { get; set; }     // lọc theo service
    }
}