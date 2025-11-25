using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class CreateStaffCommand : IRequest<StaffDto>
    {
        public Guid UserId { get; set; }
        public string Position { get; set; } = null!;
        public bool IsAvailable { get; set; } = true;
    }
}