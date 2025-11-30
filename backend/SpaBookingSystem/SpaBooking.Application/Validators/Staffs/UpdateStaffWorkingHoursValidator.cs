using FluentValidation;
using SpaBooking.Application.Requests.Staffs;
using System.Linq;

namespace SpaBooking.Application.Validators.Staffs
{
    public class UpdateStaffWorkingHoursValidator : AbstractValidator<UpdateStaffWorkingHoursCommand>
    {
        public UpdateStaffWorkingHoursValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.Slots).NotEmpty();
            RuleForEach(x => x.Slots).ChildRules(slot =>
            {
                slot.RuleFor(s => s.StartAt).LessThan(s => s.EndAt)
                    .WithMessage("StartAt phải nhỏ hơn EndAt");
            });
        }
    }
}