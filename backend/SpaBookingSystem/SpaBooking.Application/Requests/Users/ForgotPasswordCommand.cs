using MediatR;
using System.ComponentModel.DataAnnotations;

namespace SpaBooking.Application.Requests.Users
{
    public class ForgotPasswordCommand : IRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}
