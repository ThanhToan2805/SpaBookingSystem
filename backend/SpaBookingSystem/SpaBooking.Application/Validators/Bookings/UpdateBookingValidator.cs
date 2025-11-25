using FluentValidation;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.Validators.Bookings
{
    public class UpdateBookingValidator : AbstractValidator<UpdateBookingCommand>
    {
        public UpdateBookingValidator()
        {
            RuleFor(x => x.Dto.CustomerId).NotEmpty();
            RuleFor(x => x.Dto.ServiceId).NotEmpty();
            RuleFor(x => x.Dto.StartAt).NotEmpty();
            RuleFor(x => x.Dto.EndAt)
                .GreaterThan(x => x.Dto.StartAt);

            RuleFor(x => x.Dto.Status)
                .Must(s => Enum.TryParse<Domain.Entities.BookingStatus>(s, true, out _))
                .WithMessage("Invalid booking status.");
        }
    }
}