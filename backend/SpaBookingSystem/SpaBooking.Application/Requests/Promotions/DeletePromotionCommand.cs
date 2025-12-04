using MediatR;
using SpaBooking.Contracts.DTOs.Promotions;

namespace SpaBooking.Application.Requests.Promotions
{
    public class DeletePromotionCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
