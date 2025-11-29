using FluentValidation;
using SpaBooking.Application.Requests.Roles;

namespace SpaBooking.Application.Validators.Roles
{
    public class CreateRoleValidator : AbstractValidator<CreateRoleCommand>
    {
        public CreateRoleValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        }
    }
}