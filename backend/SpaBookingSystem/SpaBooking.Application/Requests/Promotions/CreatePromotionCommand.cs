using MediatR;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.Requests.Promotions
{
    public class CreatePromotionCommand : IRequest<PromotionDto>
    {
        public PromotionDto Dto { get; set; } = null!;
    }
}
