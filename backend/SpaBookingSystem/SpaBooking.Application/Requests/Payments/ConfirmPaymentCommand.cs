using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class ConfirmPaymentCommand : IRequest<PaymentDto>
    {
        public Guid PaymentId { get; set; }
        public string? TransactionCode { get; set; } // optional for QR
    }
}
