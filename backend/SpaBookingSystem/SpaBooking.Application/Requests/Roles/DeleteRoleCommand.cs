using MediatR;

namespace SpaBooking.Application.Requests.Roles
{
    public class DeleteRoleCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}