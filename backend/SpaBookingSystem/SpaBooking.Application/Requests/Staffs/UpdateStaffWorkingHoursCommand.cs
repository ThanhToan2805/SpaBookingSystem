using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class UpdateStaffWorkingHoursCommand : IRequest<List<TimeSlotDto>>
    {
        public Guid StaffId { get; set; }
        public List<TimeSlotInput> Slots { get; set; } = new List<TimeSlotInput>();
    }

    public class TimeSlotInput
    {
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}