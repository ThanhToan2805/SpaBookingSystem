using MediatR;
using SpaBooking.Application.Common;
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
        private readonly IPaymentRepository _paymentRepo;
        private readonly IBookingRepository _bookingRepo;

        public CreatePaymentHandler(IPaymentRepository paymentRepo, IBookingRepository bookingRepo)
        {
            _paymentRepo = paymentRepo;
            _bookingRepo = bookingRepo;
        }

        public async Task<PaymentDto> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.GetByIdAsync(request.BookingId);
            if (booking == null)
                throw new Exception("Booking not found");

            var payment = new Payment
            {
                BookingId = request.BookingId,
                Amount = booking.FinalPrice,
                PaymentMethod = request.PaymentMethod,
                Status = PaymentStatus.Pending,
                InvoiceCode = InvoiceCodeGenerator.Generate(),
                PaidAt = null
            };

            await _paymentRepo.AddAsync(payment);

            return new PaymentDto
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
            };
        }
    }
}