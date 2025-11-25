using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class GetPaymentByIdHandler : IRequestHandler<GetPaymentByIdQuery, PaymentDto?>
    {
        private readonly IPaymentRepository _repo;

        public GetPaymentByIdHandler(IPaymentRepository repo) => _repo = repo;

        public async Task<PaymentDto?> Handle(GetPaymentByIdQuery request, CancellationToken cancellationToken)
        {
            var payment = await _repo.GetByIdAsync(request.Id);
            if (payment == null) return null;

            return new PaymentDto
            {
                Id = payment.Id,
                BookingId = payment.BookingId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status.ToString(),
                PaidAt = payment.PaidAt,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}