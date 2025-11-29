using MediatR;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.Requests.Users
{
    public class UpdateProfileCommand : IRequest<UserDto>
    {
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }

        public UpdateProfileCommand(Guid userId, string? fullName, string? phoneNumber)
        {
            UserId = userId;
            FullName = fullName;
            PhoneNumber = phoneNumber;
        }
    }
}