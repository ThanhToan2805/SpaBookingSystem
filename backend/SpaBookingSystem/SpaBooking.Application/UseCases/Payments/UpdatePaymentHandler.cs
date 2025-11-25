using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class UpdatePaymentHandler : IRequestHandler<UpdatePaymentCommand, PaymentDto?>
    {
        private readonly IPaymentRepository _repo;

        public UpdatePaymentHandler(IPaymentRepository repo) => _repo = repo;

        public async Task<PaymentDto?> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _repo.GetByIdAsync(request.Id);
            if (payment == null) return null;

            payment.Amount = request.Amount;
            payment.PaymentMethod = request.PaymentMethod;
            payment.Status = Enum.Parse<Domain.Entities.PaymentStatus>(request.Status);
            payment.PaidAt = request.PaidAt;

            await _repo.UpdateAsync(payment);

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