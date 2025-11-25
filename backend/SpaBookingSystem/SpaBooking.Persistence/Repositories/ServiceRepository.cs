using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.Persistence.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly SpaBookingDbContext _db;

        public ServiceRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Service entity)
        {
            await _db.Services.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Service entity)
        {
            _db.Services.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Service>> GetAllAsync()
        {
            return await _db.Services.AsNoTracking().ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(Guid id)
        {
            return await _db.Services.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public IQueryable<Service> Query()
        {
            return _db.Services.AsNoTracking();
        }

        public async Task UpdateAsync(Service entity)
        {
            _db.Services.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}