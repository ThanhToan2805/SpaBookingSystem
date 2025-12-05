using MediatR;
using Microsoft.Extensions.Configuration;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Interfaces.Services;
using SpaBooking.Application.Requests.Users;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Users
{
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand>
    {
        private readonly IUserRepository _userRepo;
        private readonly IPasswordResetTokenRepository _tokenRepo;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public ForgotPasswordHandler(
            IUserRepository userRepo,
            IPasswordResetTokenRepository tokenRepo,
            IEmailService emailService,
            IConfiguration config)
        {
            _userRepo = userRepo;
            _tokenRepo = tokenRepo;
            _emailService = emailService;
            _config = config;
        }

        public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepo.GetByEmailAsync(request.Email);
            if (user == null)
                return Unit.Value; // Không tiết lộ email tồn tại hay không

            var token = Guid.NewGuid().ToString("N"); // URL-safe token
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                Expiration = DateTime.UtcNow.AddHours(1)
            };

            await _tokenRepo.AddAsync(resetToken);
            await _tokenRepo.SaveChangesAsync();

            var frontendBaseUrl = _config["Frontend:BaseUrl"];
            if (string.IsNullOrEmpty(frontendBaseUrl))
                throw new Exception("Frontend base URL is not configured.");

            var resetLink = $"{frontendBaseUrl}/auth/reset-password?token={token}";
            var html = $"Click <a href='{resetLink}'>here</a> to reset your password. Link expires in 1 hour.";

            await _emailService.SendEmailAsync(user.Email, "Reset your password", html);

            return Unit.Value;
        }
    }
}
