using FluentValidation;
using SpaBooking.Application.Requests.Promotions;
using System;

namespace SpaBooking.Application.Validators.Promotions
{
    public class DeletePromotionValidator : AbstractValidator<DeletePromotionCommand>
    {
        public DeletePromotionValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Promotion Id không được để trống.");
        }
    }
}
