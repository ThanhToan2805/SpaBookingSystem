using FluentValidation;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class CreateBookingValidator : AbstractValidator<CreateBookingCommand>
    {
        public CreateBookingValidator()
        {
            RuleFor(x => x.Dto.CustomerId).NotEmpty();
            RuleFor(x => x.Dto.ServiceId).NotEmpty();
            RuleFor(x => x.Dto.StartAt).NotEmpty();
            RuleFor(x => x.Dto.EndAt).NotEmpty();
            RuleFor(x => x.Dto.EndAt)
                .GreaterThan(x => x.Dto.StartAt)
                .WithMessage("EndAt must be greater than StartAt.");
        }
    }
}