using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class UpdateServiceHandler : IRequestHandler<UpdateServiceCommand>
    {
        private readonly IServiceRepository _repository;

        public UpdateServiceHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Service not found");

            entity.Name = request.Name;
            entity.Description = request.Description;
            entity.Price = request.Price;
            entity.DurationMinutes = request.DurationMinutes;
            entity.ImageUrl = request.ImageUrl;
            entity.CategoryId = request.CategoryId;
            entity.IsActive = request.IsActive;

            await _repository.UpdateAsync(entity);
            return Unit.Value;
        }
    }
}