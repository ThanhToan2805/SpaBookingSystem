using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Promotions;

namespace SpaBooking.Application.UseCases.Promotions
{
    public class DeletePromotionHandler : IRequestHandler<DeletePromotionCommand, bool>
    {
        private readonly IPromotionRepository _repo;

        public DeletePromotionHandler(IPromotionRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(DeletePromotionCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByIdAsync(request.Id);
            if (entity == null) return false;

            await _repo.DeleteAsync(entity);
            return true;
        }
    }
}
