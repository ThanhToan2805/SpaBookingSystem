using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators
{
    public class CreateTimeSlotValidator : AbstractValidator<CreateTimeSlotCommand>
    {
        public CreateTimeSlotValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.StartAt).LessThan(x => x.EndAt)
                .WithMessage("StartAt must be before EndAt");
        }
    }
}