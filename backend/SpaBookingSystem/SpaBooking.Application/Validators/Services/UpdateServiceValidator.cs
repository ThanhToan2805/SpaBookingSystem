using FluentValidation;
using SpaBooking.Application.Requests.Services;

namespace SpaBooking.Application.Validators.Services
{
    public class UpdateServiceValidator : AbstractValidator<UpdateServiceCommand>
    {
        public UpdateServiceValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Price).GreaterThan(0);
            RuleFor(x => x.DurationMinutes).GreaterThan(0);
            RuleFor(x => x.CategoryId).NotEqual(Guid.Empty).WithMessage("CategoryId is required");
        }
    }
}