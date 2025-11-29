using MediatR;

namespace SpaBooking.Application.Requests.Roles
{
    public class CreateRoleCommand : IRequest<Guid>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}