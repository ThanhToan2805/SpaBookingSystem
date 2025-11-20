using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using SpaBooking.Contracts.DTOs.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class GetAllServicesHandler : IRequestHandler<GetAllServicesQuery, List<ServiceDto>>
    {
        private readonly IServiceRepository _repository;

        public GetAllServicesHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ServiceDto>> Handle(GetAllServicesQuery request, CancellationToken cancellationToken)
        {
            var list = await _repository.GetAllAsync();
            return list.Select(x => new ServiceDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                DurationMinutes = x.DurationMinutes,
                ImageUrl = x.ImageUrl,
                CategoryId = x.CategoryId,
                IsActive = x.IsActive
            }).ToList();
        }
    }
}