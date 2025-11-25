using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class UpdatePaymentCommand : IRequest<PaymentDto>
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime PaidAt { get; set; }
    }
}