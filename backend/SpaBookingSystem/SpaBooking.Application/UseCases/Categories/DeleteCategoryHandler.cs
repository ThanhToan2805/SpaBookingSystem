using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Categories;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Categories
{
    public class DeleteCategoryHandler : IRequestHandler<DeleteCategoryCommand>
    {
        private readonly ICategoryRepository _repository;

        public DeleteCategoryHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.Id)
                ?? throw new KeyNotFoundException("Service not found");

            await _repository.DeleteAsync(category);
            return Unit.Value;
        }
    }
}
