using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators.TimeSlots
{
    public class GenerateSlotForBookingValidator : AbstractValidator<GenerateSlotForBookingCommand>
    {
        public GenerateSlotForBookingValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.DesiredDate).GreaterThanOrEqualTo(DateTime.UtcNow.Date);
            RuleFor(x => x.ServiceDurationMinutes).GreaterThan(0);
        }
    }
}