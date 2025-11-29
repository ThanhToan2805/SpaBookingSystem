using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Roles;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Roles
{
    public class CreateRoleHandler : IRequestHandler<CreateRoleCommand, Guid>
    {
        private readonly IRoleRepository _roleRepo;
        public CreateRoleHandler(IRoleRepository roleRepo) => _roleRepo = roleRepo;

        public async Task<Guid> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
        {
            var exists = await _roleRepo.GetByNameAsync(request.Name);
            if (exists != null) throw new Exception("Role name already exists.");

            var role = new Role
            {
                Name = request.Name,
                Description = request.Description
            };

            await _roleRepo.AddAsync(role);
            await _roleRepo.SaveChangesAsync();

            return role.Id;
        }
    }
}