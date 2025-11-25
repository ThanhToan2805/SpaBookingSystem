using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators.TimeSlots
{
    public class DeleteTimeSlotValidator : AbstractValidator<DeleteTimeSlotCommand>
    {
        public DeleteTimeSlotValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}
