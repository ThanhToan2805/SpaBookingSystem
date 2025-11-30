using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffUtilizationQuery : IRequest<StaffUtilizationDto?>
    {
        public Guid StaffId { get; set; }
        public DateTime? From { get; set; } // optional
        public DateTime? To { get; set; }   // optional
    }
}