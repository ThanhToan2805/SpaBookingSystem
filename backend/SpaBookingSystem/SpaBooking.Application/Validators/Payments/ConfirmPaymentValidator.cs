using FluentValidation;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.Validators.Payments
{
    public class ConfirmPaymentValidator : AbstractValidator<ConfirmPaymentCommand>
    {
        public ConfirmPaymentValidator()
        {
            RuleFor(p => p.PaymentId).NotEmpty().WithMessage("PaymentId is required.");
            RuleFor(p => p.TransactionCode).NotEmpty().WithMessage("TransactionCode is required.");
        }
    }
}