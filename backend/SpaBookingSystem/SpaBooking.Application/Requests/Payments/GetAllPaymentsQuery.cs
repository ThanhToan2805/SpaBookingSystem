using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Payments
{
    public class GetAllPaymentsQuery : IRequest<IEnumerable<PaymentDto>>
    {
    }
}