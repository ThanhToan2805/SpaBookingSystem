using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task AddAsync(Payment entity);
        Task<Payment?> GetByIdAsync(Guid id);
        Task<List<Payment>> GetAllAsync();
        Task UpdateAsync(Payment entity);
        Task DeleteAsync(Payment entity);
    }
}