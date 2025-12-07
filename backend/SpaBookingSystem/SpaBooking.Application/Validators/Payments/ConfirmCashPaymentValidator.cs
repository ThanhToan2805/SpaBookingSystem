using FluentValidation;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.Validators.Payments
{
    public class ConfirmCashPaymentValidator : AbstractValidator<ConfirmCashPaymentCommand>
    {
        public ConfirmCashPaymentValidator()
        {
            RuleFor(p => p.PaymentId).NotEmpty().WithMessage("PaymentId is required.");
        }
    }
}