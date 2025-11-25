using FluentValidation;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.Validators.Payments
{
    public class CreatePaymentValidator : AbstractValidator<CreatePaymentCommand>
    {
        public CreatePaymentValidator()
        {
            RuleFor(p => p.BookingId).NotEmpty();
            RuleFor(p => p.Amount).GreaterThan(0);
            RuleFor(p => p.PaymentMethod).NotEmpty();
        }
    }
}