using MediatR;
using SpaBooking.Application.Interfaces;
using SpaBooking.Application.Common.Exceptions;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Interfaces.Services;
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
            // có @ thì là email, còn lại là username
            var isEmail = request.EmailOrUsername.Contains("@");

            var user = isEmail
                ? await _userRepository.GetByEmailAsync(request.EmailOrUsername)
                : await _userRepository.GetByUsernameAsync(request.EmailOrUsername);

            if (user == null)
            {
                if (isEmail)
                    throw new NotFoundException("Email chưa được đăng ký.");
                else
                    throw new NotFoundException("Không tìm thấy username.");
            }

            // User tồn tại nhưng mật khẩu sai
            if (!BC.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedException("Sai mật khẩu.");
            }

            // Đăng nhập thành công → tạo token
            return _jwtService.GenerateToken(user);
        }
    }
}