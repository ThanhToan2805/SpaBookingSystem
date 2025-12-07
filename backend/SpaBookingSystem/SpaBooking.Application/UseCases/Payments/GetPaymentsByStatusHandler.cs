using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using SpaBooking.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class GetPaymentsByStatusQuery : IRequest<IEnumerable<PaymentDto>>
    {
        public string Status { get; set; } = string.Empty;
    }

    public class GetPaymentsByStatusHandler : IRequestHandler<GetPaymentsByStatusQuery, IEnumerable<PaymentDto>>
    {
        private readonly IPaymentRepository _paymentRepo;

        public GetPaymentsByStatusHandler(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }

        public async Task<IEnumerable<PaymentDto>> Handle(GetPaymentsByStatusQuery request, CancellationToken cancellationToken)
        {
            var payments = await _paymentRepo.GetAllAsync();

            var filtered = payments
                .Where(p => p.Status.ToString().Equals(request.Status, System.StringComparison.OrdinalIgnoreCase));

            return filtered.Select(payment => new PaymentDto
            {
                Id = payment.Id,
                BookingId = payment.BookingId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status.ToString(),
                TransactionCode = payment.TransactionCode,
                InvoiceCode = payment.InvoiceCode,
                PaidAt = payment.PaidAt,
                CreatedAt = payment.CreatedAt
            });
        }
    }
}