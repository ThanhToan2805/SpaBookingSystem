using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Roles;

namespace SpaBooking.Application.UseCases.Roles
{
    public class UpdateRoleHandler : IRequestHandler<UpdateRoleCommand>
    {
        private readonly IRoleRepository _roleRepo;
        public UpdateRoleHandler(IRoleRepository roleRepo) => _roleRepo = roleRepo;

        public async Task<Unit> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _roleRepo.GetByIdAsync(request.Id)
                ?? throw new Exception("Role not found");

            role.Name = request.Name;
            role.Description = request.Description;

            await _roleRepo.UpdateAsync(role);
            await _roleRepo.SaveChangesAsync();

            return Unit.Value;
        }
    }
}