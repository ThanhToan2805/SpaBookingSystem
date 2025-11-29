using MediatR;
using SpaBooking.Contracts.DTOs.Users;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Users
{
    public class GetAllUsersQuery : IRequest<IEnumerable<UserDto>>
    {
    }
}