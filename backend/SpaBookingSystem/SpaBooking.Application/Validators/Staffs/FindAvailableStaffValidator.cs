using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class FindAvailableStaffValidator : AbstractValidator<FindAvailableStaffQuery>
    {
        public FindAvailableStaffValidator()
        {
            RuleFor(x => x.StartAt).LessThan(x => x.EndAt)
                .WithMessage("StartAt phải nhỏ hơn EndAt");
        }
    }
}