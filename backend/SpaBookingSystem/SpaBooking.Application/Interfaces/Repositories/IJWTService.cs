using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
