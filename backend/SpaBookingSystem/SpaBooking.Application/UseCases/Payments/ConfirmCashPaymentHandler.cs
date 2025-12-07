using MediatR;
using SpaBooking.Application.Common;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Interfaces.Services;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Payments
{
    public class ConfirmCashPaymentHandler : IRequestHandler<ConfirmCashPaymentCommand, PaymentDto>
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly IBookingRepository _bookingRepo;
        private readonly IEmailService _emailService;

        public ConfirmCashPaymentHandler(IPaymentRepository paymentRepo, IBookingRepository bookingRepo, IEmailService emailService)
        {
            _paymentRepo = paymentRepo;
            _bookingRepo = bookingRepo;
            _emailService = emailService;
        }

        public async Task<PaymentDto> Handle(ConfirmCashPaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _paymentRepo.GetByIdAsync(request.PaymentId);
            if (payment == null)
                throw new Exception("Payment not found");

            payment.InvoiceCode ??= InvoiceCodeGenerator.Generate();

            payment.Status = PaymentStatus.Completed;
            payment.PaidAt = DateTime.UtcNow;

            // generate a simple transaction code for cash
            payment.TransactionCode = $"CASH-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

            await _paymentRepo.UpdateAsync(payment);

            // update booking
            var booking = await _bookingRepo.GetByIdAsync(payment.BookingId);
            if (booking == null)
                throw new Exception("Booking not found");

            booking.Status = BookingStatus.Confirmed;
            await _bookingRepo.UpdateAsync(booking);

            // Gửi email hóa đơn
            if (!string.IsNullOrEmpty(booking.Customer.Email))
            {
                var htmlBody = EmailTemplates.PaymentInvoice(
                    booking.Customer.FullName ?? booking.Customer.Username,
                    payment.InvoiceCode,
                    payment.Amount,
                    booking.Service.Name,
                    booking.StartAt
                );

                try
                {
                    await _emailService.SendEmailAsync(
                        booking.Customer.Email,
                        "Hóa đơn dịch vụ Spa",
                        htmlBody
                    );
                }
                catch (Exception ex)
                {
                    // Log lỗi, không throw
                    Console.WriteLine("Failed to send invoice email: " + ex.Message);
                }
            }

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