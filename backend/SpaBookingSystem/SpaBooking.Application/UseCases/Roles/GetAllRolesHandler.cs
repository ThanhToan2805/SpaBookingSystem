using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Roles;
using SpaBooking.Contracts.DTOs.Roles;

namespace SpaBooking.Application.UseCases.Roles
{
    public class GetAllRolesHandler : IRequestHandler<GetAllRolesQuery, IEnumerable<RoleDto>>
    {
        private readonly IRoleRepository _roleRepo;
        public GetAllRolesHandler(IRoleRepository roleRepo) => _roleRepo = roleRepo;

        public async Task<IEnumerable<RoleDto>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
        {
            var roles = await _roleRepo.GetAllAsync();
            return roles.Select(r => new RoleDto { Id = r.Id, Name = r.Name, Description = r.Description }).ToList();
        }
    }
}