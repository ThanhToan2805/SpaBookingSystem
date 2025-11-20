using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IServiceRepository
    {
        Task AddAsync(Service entity);
        Task<Service?> GetByIdAsync(Guid id);
        Task<List<Service>> GetAllAsync();
        Task UpdateAsync(Service entity);
        Task DeleteAsync(Service entity);
    }
}