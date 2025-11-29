using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Roles;

namespace SpaBooking.Application.UseCases.Roles
{
    public class DeleteRoleHandler : IRequestHandler<DeleteRoleCommand>
    {
        private readonly IRoleRepository _roleRepo;
        public DeleteRoleHandler(IRoleRepository roleRepo) => _roleRepo = roleRepo;

        public async Task<Unit> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await _roleRepo.GetByIdAsync(request.Id) ?? throw new Exception("Role not found");

            await _roleRepo.DeleteAsync(role);
            await _roleRepo.SaveChangesAsync();

            return Unit.Value;
        }
    }
}