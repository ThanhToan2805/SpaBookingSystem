using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using SpaBooking.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class CreateServiceHandler : IRequestHandler<CreateServiceCommand, Guid>
    {
        private readonly IServiceRepository _repository;

        public CreateServiceHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
        {
            var entity = new Service
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                DurationMinutes = request.DurationMinutes,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId,
                IsActive = true
            };

            await _repository.AddAsync(entity);
            return entity.Id;
        }
    }
}