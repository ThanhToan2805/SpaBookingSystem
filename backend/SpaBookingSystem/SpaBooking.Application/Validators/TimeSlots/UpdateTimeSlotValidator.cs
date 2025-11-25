using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators
{
    public class UpdateTimeSlotValidator : AbstractValidator<UpdateTimeSlotCommand>
    {
        public UpdateTimeSlotValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.StartAt).LessThan(x => x.EndAt)
                .WithMessage("StartAt must be before EndAt");
        }
    }
}