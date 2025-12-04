using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class CompleteBookingValidator : AbstractValidator<CompleteBookingCommand>
    {
        public CompleteBookingValidator()
        {
            RuleFor(x => x.BookingId).NotEmpty().WithMessage("BookingId is required.");
        }
    }
}