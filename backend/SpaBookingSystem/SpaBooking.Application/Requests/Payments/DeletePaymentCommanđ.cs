using MediatR;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class DeletePaymentCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}