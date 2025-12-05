using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using BC = BCrypt.Net.BCrypt;

namespace SpaBooking.Application.UseCases.Users
{
    public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand>
    {
        private readonly IPasswordResetTokenRepository _tokenRepo;
        private readonly IUserRepository _userRepo;

        public ResetPasswordHandler(IPasswordResetTokenRepository tokenRepo, IUserRepository userRepo)
        {
            _tokenRepo = tokenRepo;
            _userRepo = userRepo;
        }

        public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var tokenEntity = await _tokenRepo.GetByTokenAsync(request.Token);
            if (tokenEntity == null || tokenEntity.IsUsed || tokenEntity.Expiration < DateTime.UtcNow)
                throw new Exception("Invalid or expired token");

            var user = await _userRepo.GetByIdAsync(tokenEntity.UserId);
            if (user == null)
                throw new Exception("User not found");

            user.PasswordHash = BC.HashPassword(request.NewPassword);
            
            await _tokenRepo.MarkAsUsedAsync(tokenEntity);

            await _userRepo.UpdateAsync(user);
            await _tokenRepo.SaveChangesAsync();

            return Unit.Value;
        }
    }
}
