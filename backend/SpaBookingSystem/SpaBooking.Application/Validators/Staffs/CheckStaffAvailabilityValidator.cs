using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class CheckStaffAvailabilityValidator : AbstractValidator<CheckStaffAvailabilityQuery>
    {
        public CheckStaffAvailabilityValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.StartAt).LessThan(x => x.EndAt)
                .WithMessage("StartAt phải nhỏ hơn EndAt");
        }
    }
}