using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class RegisterUserCommand : IRequest<Guid>
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}