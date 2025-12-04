using FluentValidation;
using SpaBooking.Application.Requests.Promotions;
using System;

namespace SpaBooking.Application.Validators.Promotions
{
    public class CreatePromotionValidator : AbstractValidator<CreatePromotionCommand>
    {
        public CreatePromotionValidator()
        {
            RuleFor(x => x.Dto.Name)
                .NotEmpty().WithMessage("Tên chương trình khuyến mãi không được để trống.");

            RuleFor(x => x.Dto.StartAt)
                .LessThan(x => x.Dto.EndAt)
                .WithMessage("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");

            RuleFor(x => x.Dto.EndAt)
                .GreaterThan(x => x.Dto.StartAt)
                .WithMessage("Thời gian kết thúc phải lớn hơn thời gian bắt đầu.");

            RuleFor(x => x.Dto.DiscountAmount)
                .GreaterThanOrEqualTo(0).When(x => x.Dto.DiscountAmount.HasValue)
                .WithMessage("Số tiền giảm giá phải lớn hơn hoặc bằng 0.");

            RuleFor(x => x.Dto.DiscountPercent)
                .InclusiveBetween(0, 100).When(x => x.Dto.DiscountPercent.HasValue)
                .WithMessage("Phần trăm giảm giá phải từ 0 đến 100.");
        }
    }
}