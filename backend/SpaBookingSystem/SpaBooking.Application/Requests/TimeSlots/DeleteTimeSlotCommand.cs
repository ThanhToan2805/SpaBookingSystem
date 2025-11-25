using MediatR;
using System;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class DeleteTimeSlotCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}