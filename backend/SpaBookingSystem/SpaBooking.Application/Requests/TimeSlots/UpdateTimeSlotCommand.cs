using MediatR;
using System;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class UpdateTimeSlotCommand : IRequest
    {
        public Guid Id { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsAvailable { get; set; }
    }
}