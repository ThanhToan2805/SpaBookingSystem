using SpaBooking.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface IPromotionRepository
    {
        IQueryable<Promotion> Query();
        Task<List<Promotion>> GetAllAsync();
        Task<Promotion?> GetByIdAsync(Guid id);
        Task AddAsync(Promotion entity);
        Task UpdateAsync(Promotion entity);
        Task DeleteAsync(Promotion entity);
    }
}