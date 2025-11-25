using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffByIdQuery : IRequest<StaffDto?>
    {
        public Guid Id { get; set; }
    }
}