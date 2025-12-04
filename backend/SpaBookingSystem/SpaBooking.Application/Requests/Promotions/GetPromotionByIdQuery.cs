using MediatR;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.Requests.Promotions
{
    public class GetPromotionByIdQuery : IRequest<PromotionDto?>
    {
        public Guid Id { get; set; }
    }
}
