using FluentValidation;
using SpaBooking.Application.Requests.Categories;
using System;

namespace SpaBooking.Application.Validators.Categories
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");
        }
    }
}