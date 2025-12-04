using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.Interfaces.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
