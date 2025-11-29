using MediatR;
using SpaBooking.Contracts.DTOs.Roles;

namespace SpaBooking.Application.Requests.Roles
{
    public class GetRoleByIdQuery : IRequest<RoleDto?>
    {
        public Guid Id { get; set; }
    }
}