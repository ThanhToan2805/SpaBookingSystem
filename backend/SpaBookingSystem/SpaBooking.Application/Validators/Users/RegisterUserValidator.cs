using FluentValidation;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.Application.Validators
{
    public class RegisterUserValidator : AbstractValidator<RegisterUserCommand>
    {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username không được để trống");
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email không được để trống")
                .EmailAddress().WithMessage("Email không hợp lệ.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu không được để trống.")
                .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 kí tự. Vui lòng nhập lại");
            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage("Mật khẩu và Xác nhận mật khẩu không khớp. Vui lòng nhập lại");
        }
    }
}