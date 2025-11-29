using MediatR;

namespace SpaBooking.Application.Requests.Roles
{
    public class UpdateRoleCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}