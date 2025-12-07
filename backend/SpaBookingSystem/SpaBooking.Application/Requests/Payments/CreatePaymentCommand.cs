using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class CreatePaymentCommand : IRequest<PaymentDto>
    {
        public Guid BookingId { get; set; }
        public string PaymentMethod { get; set; } = null!;
    }
}