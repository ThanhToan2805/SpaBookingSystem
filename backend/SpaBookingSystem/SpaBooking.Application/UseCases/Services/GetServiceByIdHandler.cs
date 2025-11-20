using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using SpaBooking.Contracts.DTOs.Services;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class GetServiceByIdHandler : IRequestHandler<GetServiceByIdQuery, ServiceDto?>
    {
        private readonly IServiceRepository _repository;

        public GetServiceByIdHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<ServiceDto?> Handle(GetServiceByIdQuery request, CancellationToken cancellationToken)
        {
            var x = await _repository.GetByIdAsync(request.Id);
            if (x == null) return null;

            return new ServiceDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Price = x.Price,
                DurationMinutes = x.DurationMinutes,
                ImageUrl = x.ImageUrl,
                CategoryId = x.CategoryId,
                IsActive = x.IsActive
            };
        }
    }
}