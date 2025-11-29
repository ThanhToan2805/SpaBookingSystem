using MediatR;
using SpaBooking.Application.Interfaces;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using BC = BCrypt.Net.BCrypt;

namespace SpaBooking.Application.UseCases.Users
{
    public class LoginUserHandler : IRequestHandler<LoginUserQuery, string>
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public LoginUserHandler(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<string> Handle(LoginUserQuery request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByEmailAsync(request.EmailOrUsername)
                       ?? await _userRepository.GetByUsernameAsync(request.EmailOrUsername);

            if (user == null || !BC.Verify(request.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            return _jwtService.GenerateToken(user);
        }
    }
}