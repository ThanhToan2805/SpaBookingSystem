using FluentValidation;
using SpaBooking.Application.Requests.Payments;

namespace SpaBooking.Application.Validators.Payments
{
    public class DeletePaymentValidator : AbstractValidator<DeletePaymentCommand>
    {
        public DeletePaymentValidator()
        {
            RuleFor(p => p.Id).NotEmpty();
        }
    }
}