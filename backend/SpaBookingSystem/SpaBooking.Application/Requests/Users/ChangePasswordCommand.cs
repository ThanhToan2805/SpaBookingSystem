using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class ChangePasswordCommand : IRequest
    {
        public Guid UserId { get; set; } // User đang login
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
    }
}