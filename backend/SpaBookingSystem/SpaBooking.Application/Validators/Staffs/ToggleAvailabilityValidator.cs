using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class ToggleAvailabilityValidator : AbstractValidator<ToggleAvailabilityCommand>
    {
        public ToggleAvailabilityValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
        }
    }
}