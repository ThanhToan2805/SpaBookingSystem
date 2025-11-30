using FluentValidation;
using SpaBooking.Application.Requests.TimeSlots;

namespace SpaBooking.Application.Validators.TimeSlots
{
    public class GetAvailableTimeSlotsForServiceValidator : AbstractValidator<GetAvailableTimeSlotsForServiceQuery>
    {
        public GetAvailableTimeSlotsForServiceValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.StartAt).LessThan(x => x.EndAt)
                .WithMessage("StartAt phải nhỏ hơn EndAt");
        }
    }
}