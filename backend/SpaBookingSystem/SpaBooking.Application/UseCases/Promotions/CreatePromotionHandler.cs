using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Promotions;
using SpaBooking.Contracts.DTOs.Promotions;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Promotions
{
    public class CreatePromotionHandler : IRequestHandler<CreatePromotionCommand, PromotionDto>
    {
        private readonly IPromotionRepository _repo;

        public CreatePromotionHandler(IPromotionRepository repo)
        {
            _repo = repo;
        }

        public async Task<PromotionDto> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
        {
            var entity = new Promotion
            {
                Name = request.Dto.Name,
                DiscountAmount = request.Dto.DiscountAmount,
                DiscountPercent = request.Dto.DiscountPercent,
                StartAt = request.Dto.StartAt,
                EndAt = request.Dto.EndAt,
                IsActive = request.Dto.IsActive
            };

            await _repo.AddAsync(entity);

            request.Dto.Id = entity.Id;
            return request.Dto;
        }
    }
}
