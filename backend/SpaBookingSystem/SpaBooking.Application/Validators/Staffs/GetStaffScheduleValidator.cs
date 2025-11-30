using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class GetStaffScheduleValidator : AbstractValidator<GetStaffScheduleQuery>
    {
        public GetStaffScheduleValidator()
        {
            RuleFor(x => x.StaffId).NotEmpty();
        }
    }
}