using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class GenerateSlotForBookingCommand : IRequest<List<TimeSlotGroupDto>>
    {
        public Guid StaffId { get; set; }
        public DateTime DesiredDate { get; set; }   // Ngày khách muốn book
        public int ServiceDurationMinutes { get; set; } // Duration của dịch vụ
    }
}