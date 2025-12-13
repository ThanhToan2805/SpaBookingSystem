using MediatR;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.Requests.Users
{
    public class GetEligibleStaffUsersQuery : IRequest<List<EligibleStaffUserDto>>
    {
    }
}