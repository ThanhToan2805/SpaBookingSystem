using MediatR;
using SpaBooking.Contracts.DTOs.Payments;
using System;

namespace SpaBooking.Application.Requests.Payments
{
    public class GeneratePaymentQRCodeCommand : IRequest<string> // trả về base64 QR
    {
        public Guid PaymentId { get; set; }
    }
}