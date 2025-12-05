using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token);
        Task<PasswordResetToken?> GetByTokenAsync(string token);
        Task MarkAsUsedAsync(PasswordResetToken token);
        Task<bool> SaveChangesAsync();
    }
}