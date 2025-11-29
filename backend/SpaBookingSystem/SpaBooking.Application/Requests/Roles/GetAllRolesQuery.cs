using MediatR;
using SpaBooking.Contracts.DTOs.Roles;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Roles
{
    public class GetAllRolesQuery : IRequest<IEnumerable<RoleDto>> { }
}