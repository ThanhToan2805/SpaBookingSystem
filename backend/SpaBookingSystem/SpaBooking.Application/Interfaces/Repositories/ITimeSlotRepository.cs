using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Application.Interfaces.Repositories
{
    public interface ITimeSlotRepository
    {
        Task AddAsync(TimeSlot entity);
        Task UpdateAsync(TimeSlot entity);
        Task DeleteAsync(TimeSlot entity);
        Task<TimeSlot?> GetByIdAsync(Guid id);
        IQueryable<TimeSlot> Query();
    }
}