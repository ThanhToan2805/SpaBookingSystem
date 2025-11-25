using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Domain.Entities;
using SpaBooking.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.Persistence.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly SpaBookingDbContext _db;

        public PaymentRepository(SpaBookingDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Payment entity)
        {
            await _db.Payments.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Payment entity)
        {
            _db.Payments.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Payment>> GetAllAsync()
        {
            return await _db.Payments.AsNoTracking().ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(Guid id)
        {
            return await _db.Payments.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task UpdateAsync(Payment entity)
        {
            _db.Payments.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}