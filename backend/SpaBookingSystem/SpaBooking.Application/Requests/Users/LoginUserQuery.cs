using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class LoginUserQuery : IRequest<string>  // return JWT token
    {
        public string EmailOrUsername { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}