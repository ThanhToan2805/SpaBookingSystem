using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class CreatePaymentCommand : IRequest<PaymentDto>
    {
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!;
        public DateTime PaidAt { get; set; }
    }
}