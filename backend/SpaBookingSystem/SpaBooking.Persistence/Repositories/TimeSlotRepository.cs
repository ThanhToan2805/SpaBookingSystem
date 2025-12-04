using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Persistence.Repositories
{
    public class TimeSlotRepository : ITimeSlotRepository
    {
        private readonly SpaBookingDbContext _db;

        public TimeSlotRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(TimeSlot entity)
        {
            await _db.TimeSlots.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(TimeSlot entity)
        {
            _db.Entry(entity).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(TimeSlot entity)
        {
            _db.TimeSlots.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<TimeSlot?> GetByIdAsync(Guid id)
        {
            return await _db.TimeSlots
                .Include(t => t.Booking)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public IQueryable<TimeSlot> Query()
        {
            return _db.TimeSlots.Include(t => t.Booking).AsNoTracking();
        }
    }
}