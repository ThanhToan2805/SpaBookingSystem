using FluentValidation;
using SpaBooking.Application.Requests.Categories;
using System;

namespace SpaBooking.Application.Validators.Categories
{
    public class DeleteCategoryValidator : AbstractValidator<DeleteCategoryCommand>
    {
        public DeleteCategoryValidator()
        {
            RuleFor(x => x.Id).NotEqual(Guid.Empty).WithMessage("Id is required");
        }
    }
}