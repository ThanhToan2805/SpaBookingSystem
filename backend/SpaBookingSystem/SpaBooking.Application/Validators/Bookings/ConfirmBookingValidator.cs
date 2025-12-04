using FluentValidation;

namespace SpaBooking.Application.Requests.Bookings
{
    public class ConfirmBookingValidator : AbstractValidator<ConfirmBookingCommand>
    {
        public ConfirmBookingValidator()
        {
            RuleFor(x => x.BookingId)
                .NotEmpty().WithMessage("BookingId is required.");
        }
    }
}