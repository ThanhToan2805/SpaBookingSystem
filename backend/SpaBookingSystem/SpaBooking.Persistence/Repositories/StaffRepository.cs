using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Persistence.Repositories
{
    public class StaffRepository : IStaffRepository
    {
        private readonly SpaBookingDbContext _db;

        public StaffRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Staff entity)
        {
            await _db.Staffs.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Staff entity)
        {
            _db.Staffs.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Staff entity)
        {
            _db.Staffs.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<Staff?> GetByIdAsync(Guid id)
        {
            return await _db.Staffs
                .Include(s => s.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Staff>> GetAllAsync()
        {
            return await _db.Staffs
                .Include(s => s.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public IQueryable<Staff> Query()
        {
            return _db.Staffs.AsNoTracking();
        }
    }
}