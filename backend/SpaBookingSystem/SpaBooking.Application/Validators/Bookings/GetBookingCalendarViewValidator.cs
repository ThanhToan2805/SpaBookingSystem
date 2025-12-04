using FluentValidation;
using SpaBooking.Application.Requests.Bookings;
using System;

namespace SpaBooking.Application.Validators.Bookings
{
    public class GetBookingCalendarViewValidator : AbstractValidator<GetBookingCalendarViewQuery>
    {
        public GetBookingCalendarViewValidator()
        {
            RuleFor(x => x.StartDate).NotEmpty();
            RuleFor(x => x.EndDate).NotEmpty();
            RuleFor(x => x.EndDate)
                .GreaterThanOrEqualTo(x => x.StartDate)
                .WithMessage("EndDate must be greater than or equal to StartDate.");
        }
    }
}