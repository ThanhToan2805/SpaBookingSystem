using MediatR;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.Requests.Users
{
    public class UpdateProfileCommand : IRequest<UserDto>
    {
        public Guid UserId { get; set; }
        public string Username { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }

        public UpdateProfileCommand(Guid userId, string userName, string? fullName, string email, string? phoneNumber)
        {
            UserId = userId;
            Username = userName;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
        }
    }
}