using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Services;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Services
{
    public class DeleteServiceHandler : IRequestHandler<DeleteServiceCommand>
    {
        private readonly IServiceRepository _repository;

        public DeleteServiceHandler(IServiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteServiceCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Service not found");

            await _repository.DeleteAsync(entity);
            return Unit.Value;
        }
    }
}