using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class GetBookingsByUserValidator : AbstractValidator<GetBookingsByUserQuery>
    {
        public GetBookingsByUserValidator()
        {
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
}