using FluentValidation;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.Application.Validators.Users
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
    {
        public ResetPasswordValidator()
        {
            RuleFor(x => x.Token).NotEmpty();
            RuleFor(x => x.NewPassword).MinimumLength(6);
            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.NewPassword).WithMessage("Confirm password does not match.");
        }
    }
}
