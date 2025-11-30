using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class ToggleAvailabilityCommand : IRequest<StaffDto?>
    {
        public Guid StaffId { get; set; }
        public bool IsAvailable { get; set; }
    }
}