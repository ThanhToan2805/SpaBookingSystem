using MediatR;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.Requests.Users
{
    public class GetProfileQuery : IRequest<UserDto>
    {
        public Guid UserId { get; set; }   // lấy từ JWT
        public GetProfileQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}