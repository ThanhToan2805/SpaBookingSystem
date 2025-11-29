using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Roles;
using SpaBooking.Contracts.DTOs.Roles;

namespace SpaBooking.Application.UseCases.Roles
{
    public class GetRoleByIdHandler : IRequestHandler<GetRoleByIdQuery, RoleDto?>
    {
        private readonly IRoleRepository _roleRepo;
        public GetRoleByIdHandler(IRoleRepository roleRepo) => _roleRepo = roleRepo;

        public async Task<RoleDto?> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
        {
            var role = await _roleRepo.GetByIdAsync(request.Id);
            if (role == null) return null;
            return new RoleDto { Id = role.Id, Name = role.Name, Description = role.Description };
        }
    }
}