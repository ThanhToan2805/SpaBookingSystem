using MediatR;
using SpaBooking.Application.Common;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Interfaces.Services;
using SpaBooking.Application.Requests.Payments;
using SpaBooking.Contracts.DTOs.Payments;
using SpaBooking.Domain.Entities;
using System;

namespace SpaBooking.Application.UseCases.Payments
{
    public class ConfirmPaymentHandler : IRequestHandler<ConfirmPaymentCommand, PaymentDto>
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly IBookingRepository _bookingRepo;
        private readonly IEmailService _emailService;

        public ConfirmPaymentHandler(IPaymentRepository paymentRepo, IBookingRepository bookingRepo, IEmailService emailService)
        {
            _paymentRepo = paymentRepo;
            _bookingRepo = bookingRepo;
            _emailService = emailService;
        }

        public async Task<PaymentDto> Handle(ConfirmPaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _paymentRepo.GetByIdAsync(request.PaymentId);
            if (payment == null) throw new Exception("Payment not found");

            // ensure invoice code exists
            //payment.InvoiceCode ??= InvoiceCodeGenerator.Generate();

            payment.Status = PaymentStatus.Completed;
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionCode = request.TransactionCode ?? "mock";

            await _paymentRepo.UpdateAsync(payment);

            // update booking safely
            var booking = await _bookingRepo.GetByIdAsync(payment.BookingId);
            if (booking == null) throw new Exception("Booking not found");
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
