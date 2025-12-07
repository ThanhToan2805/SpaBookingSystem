using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class ConfirmCashPaymentCommand : IRequest<PaymentDto>
    {
        public Guid PaymentId { get; set; }
    }
}