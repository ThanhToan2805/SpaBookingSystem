using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffByPositionQuery : IRequest<List<StaffDto>>
    {
        public string Position { get; set; } = null!;
    }
}