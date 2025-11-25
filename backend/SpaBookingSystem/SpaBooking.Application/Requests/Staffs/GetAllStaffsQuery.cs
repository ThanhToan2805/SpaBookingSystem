using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetAllStaffsQuery : IRequest<IEnumerable<StaffDto>>
    {
    }
}