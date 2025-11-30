using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class GetTimeSlotsByStaffQuery : IRequest<List<TimeSlotDto>>
    {
        public Guid StaffId { get; set; }
        public DateTime? From { get; set; } // optional
        public DateTime? To { get; set; }   // optional
    }
}