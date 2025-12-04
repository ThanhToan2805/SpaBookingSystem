using MediatR;
using SpaBooking.Contracts.DTOs.Bookings;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Bookings
{
    public class GetBookingsByDateQuery : IRequest<List<BookingDto>>
    {
        public DateTime Date { get; set; }             // ngày muốn lấy booking
        public Guid? StaffId { get; set; }            // lọc theo staff
        public Guid? ServiceId { get; set; }          // lọc theo service
        public string? Status { get; set; }           // lọc theo trạng thái
    }
}