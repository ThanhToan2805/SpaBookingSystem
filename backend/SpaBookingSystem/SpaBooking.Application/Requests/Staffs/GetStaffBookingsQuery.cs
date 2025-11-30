using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffBookingsQuery : IRequest<List<BookingDto>>
    {
        public Guid StaffId { get; set; }
        public DateTime? From { get; set; }      // Lọc từ ngày
        public DateTime? To { get; set; }        // Lọc đến ngày
        public BookingStatus? Status { get; set; } // Lọc theo trạng thái booking
    }
}