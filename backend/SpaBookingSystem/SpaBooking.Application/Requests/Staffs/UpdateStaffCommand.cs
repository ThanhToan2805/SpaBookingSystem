using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class UpdateStaffCommand : IRequest<StaffDto>
    {
        public Guid Id { get; set; }
        public string Position { get; set; } = null!;
        public bool IsAvailable { get; set; }
    }
}