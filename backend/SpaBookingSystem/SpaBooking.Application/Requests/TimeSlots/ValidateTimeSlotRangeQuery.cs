using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class ValidateTimeSlotRangeQuery : IRequest<ValidateTimeSlotRangeResultDto>
    {
        public Guid StaffId { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}