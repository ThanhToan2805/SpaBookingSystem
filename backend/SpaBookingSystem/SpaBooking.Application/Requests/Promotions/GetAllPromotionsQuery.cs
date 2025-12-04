using MediatR;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.Requests.Promotions
{
    public class GetAllPromotionsQuery : IRequest<List<PromotionDto>> { }
}
