using FluentValidation;
using SpaBooking.Application.Requests.Staffs;

namespace SpaBooking.Application.Validators.Staffs
{
    public class DeleteStaffValidator : AbstractValidator<DeleteStaffCommand>
    {
        public DeleteStaffValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}