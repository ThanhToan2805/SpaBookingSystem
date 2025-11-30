using MediatR;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.TimeSlots
{
    public class GetAvailableTimeSlotsForServiceQuery : IRequest<List<TimeSlotDto>>
    {
        public Guid StaffId { get; set; }      // có thể chỉ định staff cụ thể
        public DateTime StartAt { get; set; }  // khoảng cần slot
        public DateTime EndAt { get; set; }
    }
}