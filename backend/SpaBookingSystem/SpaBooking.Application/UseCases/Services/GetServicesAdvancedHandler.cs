using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using SpaBooking.Contracts.DTOs.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class GetServicesAdvancedHandler : IRequestHandler<GetServicesAdvancedQuery, IEnumerable<ServiceDto>>
    {
        private readonly IServiceRepository _repository;

        public GetServicesAdvancedHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ServiceDto>> Handle(GetServicesAdvancedQuery request, CancellationToken cancellationToken)
        {
            var query = _repository.Query(); // IQueryable<Service>

            // Filter
            if (!string.IsNullOrEmpty(request.SearchKeyword))
                query = query.Where(s => s.Name.Contains(request.SearchKeyword));

            if (request.CategoryId.HasValue)
                query = query.Where(s => s.CategoryId == request.CategoryId.Value);

            if (request.MinPrice.HasValue)
                query = query.Where(s => s.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(s => s.Price <= request.MaxPrice.Value);

            if (request.MinDuration.HasValue)
                query = query.Where(s => s.DurationMinutes >= request.MinDuration.Value);

            if (request.MaxDuration.HasValue)
                query = query.Where(s => s.DurationMinutes <= request.MaxDuration.Value);

            // Sort
            query = request.SortBy?.ToLower() switch
            {
                "name" => request.SortDesc ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
                "price" => request.SortDesc ? query.OrderByDescending(s => s.Price) : query.OrderBy(s => s.Price),
                "duration" => request.SortDesc ? query.OrderByDescending(s => s.DurationMinutes) : query.OrderBy(s => s.DurationMinutes),
                _ => query.OrderBy(s => s.Name)
            };

            // Pagination
            var skip = (request.Page - 1) * request.PageSize;
            query = query.Skip(skip).Take(request.PageSize);

            // Lấy entity từ DB với EF Core async
            var entities = await query.ToListAsync(cancellationToken);

            // Map sang DTO
            var services = entities.Select(s => new ServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Price = s.Price,
                DurationMinutes = s.DurationMinutes,
                ImageUrl = s.ImageUrl,
                CategoryId = s.CategoryId,
                IsActive = s.IsActive
            }).ToList();

            return services;
        }
    }
}