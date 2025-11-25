using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class GetAllTimeSlotsQuery : IRequest<IEnumerable<TimeSlotDto>>
    {
        public Guid? StaffId { get; set; } // optional filter
    }
}
