using FluentValidation;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.Application.Validators.Users
{
    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordCommand>
    {
        public ForgotPasswordValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }
}
