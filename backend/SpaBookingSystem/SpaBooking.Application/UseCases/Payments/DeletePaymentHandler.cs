using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Payments;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Payments
{
    public class DeletePaymentHandler : IRequestHandler<DeletePaymentCommand>
    {
        private readonly IPaymentRepository _repo;

        public DeletePaymentHandler(IPaymentRepository repo) => _repo = repo;

        public async Task<Unit> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _repo.GetByIdAsync(request.Id);
            if (payment != null)
                await _repo.DeleteAsync(payment);

            return Unit.Value;
        }
    }
}