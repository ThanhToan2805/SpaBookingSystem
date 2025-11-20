using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Categories;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Categories
{
    public class UpdateCategoryHandler : IRequestHandler<UpdateCategoryCommand>
    {
        private readonly ICategoryRepository _repository;

        public UpdateCategoryHandler(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = await _repository.GetByIdAsync(request.Id);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            category.Name = request.Name;
            category.Description = request.Description;

            await _repository.UpdateAsync(category);
            return Unit.Value;
        }
    }
}
