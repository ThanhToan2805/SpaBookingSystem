using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class GetBookingsByDateValidator : AbstractValidator<GetBookingsByDateQuery>
    {
        public GetBookingsByDateValidator()
        {
            RuleFor(x => x.Date).NotEmpty();
        }
    }
}