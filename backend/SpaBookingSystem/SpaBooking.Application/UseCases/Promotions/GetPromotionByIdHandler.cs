using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Promotions;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.UseCases.Promotions
{
    public class GetPromotionByIdHandler : IRequestHandler<GetPromotionByIdQuery, PromotionDto?>
    {
        private readonly IPromotionRepository _repo;

        public GetPromotionByIdHandler(IPromotionRepository repo)
        {
            _repo = repo;
        }

        public async Task<PromotionDto?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
        {
            var p = await _repo.GetByIdAsync(request.Id);
            if (p == null) return null;
            return new PromotionDto
            {
                Id = p.Id,
                Name = p.Name,
                DiscountAmount = p.DiscountAmount,
                DiscountPercent = p.DiscountPercent,
                StartAt = p.StartAt,
                EndAt = p.EndAt,
                IsActive = p.IsActive
            };
        }
    }
}
