using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class UpdateUserCommand : IRequest
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? RoleName { get; set; }
    }
}