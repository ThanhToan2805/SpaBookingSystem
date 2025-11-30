using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class GetStaffByPositionValidator : AbstractValidator<GetStaffByPositionQuery>
    {
        public GetStaffByPositionValidator()
        {
            RuleFor(x => x.Position)
                .NotEmpty()
                .MaximumLength(100);
        }
    }
}