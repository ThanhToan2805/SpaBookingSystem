using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        IQueryable<Booking> Query();
        Task<Booking?> GetByIdAsync(Guid id);
        Task AddAsync(Booking entity);
        Task UpdateAsync(Booking entity);
        Task DeleteAsync(Booking entity);
    }
}