using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class GetPaymentByBookingIdQuery : IRequest<IEnumerable<PaymentDto>>
    {
        public Guid BookingId { get; set; }
    }

}