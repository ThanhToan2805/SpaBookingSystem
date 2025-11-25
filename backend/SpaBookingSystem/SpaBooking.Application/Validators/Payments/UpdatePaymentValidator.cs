using FluentValidation;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.Validators.Payments
{
    public class UpdatePaymentValidator : AbstractValidator<UpdatePaymentCommand>
    {
        public UpdatePaymentValidator()
        {
            RuleFor(p => p.Id).NotEmpty();
            RuleFor(p => p.Amount).GreaterThan(0);
            RuleFor(p => p.PaymentMethod).NotEmpty();
            RuleFor(p => p.Status).NotEmpty();
        }
    }
}