using FluentValidation;
using SpaBooking.Application.Requests.Users;

namespace SpaBooking.Application.Validators.Users
{
    public class LoginUserValidator : AbstractValidator<LoginUserQuery>
    {
        public LoginUserValidator()
        {
            RuleFor(x => x.EmailOrUsername)
                .NotEmpty().WithMessage("Vui lòng nhập email hoặc tên đăng nhập.")
                .MinimumLength(3).WithMessage("Tên đăng nhập hoặc email phải có ít nhất 3 ký tự.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Vui lòng nhập mật khẩu.")
                .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự. Vui lòng nhập lại");
        }
    }
}