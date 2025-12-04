using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class RescheduleBookingValidator : AbstractValidator<RescheduleBookingCommand>
    {
        public RescheduleBookingValidator()
        {
            RuleFor(x => x.BookingId).NotEmpty();
            RuleFor(x => x.NewStartAt)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("New start time must be in the future.");
        }
    }
}