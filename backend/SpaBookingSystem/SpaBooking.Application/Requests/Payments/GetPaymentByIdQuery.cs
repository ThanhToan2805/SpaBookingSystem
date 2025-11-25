using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class GetPaymentByIdQuery : IRequest<PaymentDto?>
    {
        public Guid Id { get; set; }
    }
}