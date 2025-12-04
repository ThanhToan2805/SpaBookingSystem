using MediatR;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.Requests.Promotions
{
    public class UpdatePromotionCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public PromotionDto Dto { get; set; } = null!;
    }
}
