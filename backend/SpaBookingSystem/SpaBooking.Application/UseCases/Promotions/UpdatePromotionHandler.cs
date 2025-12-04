using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Promotions;

namespace SpaBooking.Application.UseCases.Promotions
{
    public class UpdatePromotionHandler : IRequestHandler<UpdatePromotionCommand, bool>
    {
        private readonly IPromotionRepository _repo;
        public UpdatePromotionHandler(IPromotionRepository repo)
        {
            _repo = repo;
        }
        public async Task<bool> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByIdAsync(request.Id);
            if (entity == null) return false;

            entity.Name = request.Dto.Name;
            entity.DiscountAmount = request.Dto.DiscountAmount;
            entity.DiscountPercent = request.Dto.DiscountPercent;
            entity.StartAt = request.Dto.StartAt;
            entity.EndAt = request.Dto.EndAt;
            entity.IsActive = request.Dto.IsActive;

            await _repo.UpdateAsync(entity);
            return true;
        }
    }
}
