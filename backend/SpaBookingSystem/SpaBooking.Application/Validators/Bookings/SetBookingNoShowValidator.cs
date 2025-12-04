using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class SetBookingNoShowValidator : AbstractValidator<SetBookingNoShowCommand>
    {
        public SetBookingNoShowValidator()
        {
            RuleFor(x => x.BookingId).NotEmpty().WithMessage("BookingId is required.");
        }
    }
}