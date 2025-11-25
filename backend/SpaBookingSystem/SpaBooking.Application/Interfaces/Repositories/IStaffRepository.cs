using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IStaffRepository
    {
        Task AddAsync(Staff entity);
        Task UpdateAsync(Staff entity);
        Task DeleteAsync(Staff entity);
        Task<Staff?> GetByIdAsync(Guid id);
        Task<List<Staff>> GetAllAsync();
        IQueryable<Staff> Query();
    }
}