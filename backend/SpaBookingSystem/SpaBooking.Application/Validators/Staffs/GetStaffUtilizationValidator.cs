using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class GetStaffUtilizationValidator : AbstractValidator<GetStaffUtilizationQuery>
    {
        public GetStaffUtilizationValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
            RuleFor(x => x.To)
                .GreaterThanOrEqualTo(x => x.From)
                .When(x => x.From.HasValue && x.To.HasValue)
                .WithMessage("'To' phải lớn hơn hoặc bằng 'From'");
        }
    }
}