using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Persistence.Repositories
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly SpaBookingDbContext _db;

        public PromotionRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public IQueryable<Promotion> Query() => _db.Promotions.AsNoTracking();

        public async Task<List<Promotion>> GetAllAsync()
            => await _db.Promotions.AsNoTracking().ToListAsync();

        public async Task<Promotion?> GetByIdAsync(Guid id)
            => await _db.Promotions.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);

        public async Task AddAsync(Promotion entity)
        {
            await _db.Promotions.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Promotion entity)
        {
            _db.Promotions.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Promotion entity)
        {
            _db.Promotions.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }
}