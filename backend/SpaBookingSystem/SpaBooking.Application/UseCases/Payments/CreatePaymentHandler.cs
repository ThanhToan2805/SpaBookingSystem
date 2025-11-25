using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using SpaBooking.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, PaymentDto>
    {
        private readonly IPaymentRepository _repo;

        public CreatePaymentHandler(IPaymentRepository repo) => _repo = repo;

        public async Task<PaymentDto> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = new Payment
            {
                BookingId = request.BookingId,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                PaidAt = request.PaidAt
            };

            await _repo.AddAsync(payment);

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