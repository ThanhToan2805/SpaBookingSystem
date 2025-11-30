using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffWorkingHoursQuery : IRequest<List<StaffWorkingHoursDto>>
    {
        public Guid StaffId { get; set; }
        public DateTime? From { get; set; } // optional
        public DateTime? To { get; set; }   // optional
    }
}