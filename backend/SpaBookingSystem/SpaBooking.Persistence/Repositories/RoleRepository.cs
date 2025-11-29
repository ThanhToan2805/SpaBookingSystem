using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;

namespace SpaBooking.Persistence.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly SpaBookingDbContext _context;

        public RoleRepository(SpaBookingDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
        }

        public async Task DeleteAsync(Role role)
        {
            _context.Roles.Remove(role);
            await Task.CompletedTask;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _context.Roles.AsNoTracking().ToListAsync();
        }

        public async Task<Role?> GetByIdAsync(Guid id)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Role?> GetByNameAsync(string name)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
        }

        public async Task UpdateAsync(Role role)
        {
            _context.Roles.Update(role);
            await Task.CompletedTask;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}