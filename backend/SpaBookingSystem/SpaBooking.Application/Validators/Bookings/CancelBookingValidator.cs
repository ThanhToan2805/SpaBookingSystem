using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class CancelBookingValidator : AbstractValidator<CancelBookingCommand>
    {
        public CancelBookingValidator()
        {
            RuleFor(x => x.BookingId).NotEmpty();
        }
    }
}