using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Payments
{
    public class GetPaymentsByStatusQuery : IRequest<IEnumerable<PaymentDto>>
    {
        public string Status { get; set; } = string.Empty;
    }
}