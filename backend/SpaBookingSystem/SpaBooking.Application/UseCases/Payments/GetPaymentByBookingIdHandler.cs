using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class GetPaymentByBookingIdHandler : IRequestHandler<GetPaymentByBookingIdQuery, IEnumerable<PaymentDto>>
    {
        private readonly IPaymentRepository _paymentRepo;

        public GetPaymentByBookingIdHandler(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }

        public async Task<IEnumerable<PaymentDto>> Handle(GetPaymentByBookingIdQuery request, CancellationToken cancellationToken)
        {
            var payments = await _paymentRepo.GetAllAsync();
            var filtered = payments.Where(p => p.BookingId == request.BookingId);

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