using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;

namespace SpaBooking.Persistence.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly SpaBookingDbContext _db;

        public BookingRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public IQueryable<Booking> Query()
            => _db.Bookings.AsNoTracking();

        public async Task<Booking?> GetByIdAsync(Guid id)
            => await _db.Bookings.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

        public async Task AddAsync(Booking entity)
        {
            await _db.Bookings.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Booking entity)
        {
            _db.Entry(entity).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Booking entity)
        {
            _db.Bookings.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> HasConflictAsync(Guid staffId, DateTime startAt, DateTime endAt)
        {
            return await _db.Bookings
                .AnyAsync(b =>
                    b.StaffId == staffId &&
                    b.StartAt < endAt &&
                    b.EndAt > startAt &&
                    b.Status != BookingStatus.Cancelled
                );
        }
    }
}