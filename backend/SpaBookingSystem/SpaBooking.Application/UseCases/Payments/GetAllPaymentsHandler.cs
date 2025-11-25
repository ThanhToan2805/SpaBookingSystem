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
    public class GetAllPaymentsHandler : IRequestHandler<GetAllPaymentsQuery, IEnumerable<PaymentDto>>
    {
        private readonly IPaymentRepository _repo;

        public GetAllPaymentsHandler(IPaymentRepository repo) => _repo = repo;

        public async Task<IEnumerable<PaymentDto>> Handle(GetAllPaymentsQuery request, CancellationToken cancellationToken)
        {
            var payments = await _repo.GetAllAsync();
            return payments.Select(p => new PaymentDto
            {
                Id = p.Id,
                BookingId = p.BookingId,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                Status = p.Status.ToString(),
                PaidAt = p.PaidAt,
                CreatedAt = p.CreatedAt
            });
        }
    }
}