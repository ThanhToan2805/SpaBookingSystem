using FluentValidation;
using SpaBooking.Application.Requests.Services;

namespace SpaBooking.Application.Validators.Services
{
    public class CreateServiceValidator : AbstractValidator<CreateServiceCommand>
    {
        public CreateServiceValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Service name is required.")
                                .MaximumLength(200);
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Price must be > 0.");
            RuleFor(x => x.DurationMinutes).GreaterThan(0).WithMessage("Duration must be > 0.");
            RuleFor(x => x.CategoryId).NotEqual(Guid.Empty).WithMessage("CategoryId is required");
        }
    }
}