using FluentValidation;
using SpaBooking.Application.Requests.Services;

namespace SpaBooking.Application.Validators.Services
{
    internal class DeleteServiceValidator : AbstractValidator<DeleteServiceCommand>
    {
        public DeleteServiceValidator()
        {
            RuleFor(x => x.Id).NotEqual(Guid.Empty).WithMessage("Id is required");
        }
    }
}
