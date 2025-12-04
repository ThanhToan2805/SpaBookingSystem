using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Promotions;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.UseCases.Promotions
{
    public class GetAllPromotionsHandler : IRequestHandler<GetAllPromotionsQuery, List<PromotionDto>>
    {
        private readonly IPromotionRepository _repo;

        public GetAllPromotionsHandler(IPromotionRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<PromotionDto>> Handle(GetAllPromotionsQuery request, CancellationToken cancellationToken)
        {
            var list = await _repo.GetAllAsync();
            return list.Select(p => new PromotionDto
            {
                Id = p.Id,
                Name = p.Name,
                DiscountAmount = p.DiscountAmount,
                DiscountPercent = p.DiscountPercent,
                StartAt = p.StartAt,
                EndAt = p.EndAt,
                IsActive = p.IsActive
            }).ToList();
        }
    }
}
