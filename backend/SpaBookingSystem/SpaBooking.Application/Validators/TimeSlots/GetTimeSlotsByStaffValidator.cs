using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators.TimeSlots
{
    public class GetTimeSlotsByStaffValidator : AbstractValidator<GetTimeSlotsByStaffQuery>
    {
        public GetTimeSlotsByStaffValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.To)
                .GreaterThanOrEqualTo(x => x.From)
                .When(x => x.From.HasValue && x.To.HasValue)
                .WithMessage("'To' phải lớn hơn hoặc bằng 'From'");
        }
    }
}