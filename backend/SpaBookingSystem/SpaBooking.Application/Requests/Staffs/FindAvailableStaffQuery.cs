using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class FindAvailableStaffQuery : IRequest<List<StaffDto>>
    {
        public string? Position { get; set; } // optional
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}