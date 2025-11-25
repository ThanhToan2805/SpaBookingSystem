using MediatR;
using System;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class CreateTimeSlotCommand : IRequest<Guid>
    {
        public Guid StaffId { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}