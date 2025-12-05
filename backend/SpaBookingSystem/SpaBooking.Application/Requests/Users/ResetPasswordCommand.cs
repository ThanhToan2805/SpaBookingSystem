using MediatR;
using System.ComponentModel.DataAnnotations;

namespace SpaBooking.Application.Requests.Users
{
    public class ResetPasswordCommand : IRequest
    {
        [Required]
        public string Token { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = null!;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Confirm password does not match.")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
