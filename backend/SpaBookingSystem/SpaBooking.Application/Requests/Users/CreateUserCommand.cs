using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class CreateUserCommand : IRequest<Guid>
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
        public string RoleName { get; set; } = "Customer"; // admin có thể chọn role
    }
}