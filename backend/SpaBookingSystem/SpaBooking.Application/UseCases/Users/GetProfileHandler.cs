using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.UseCases.Users
{
    public class GetProfileHandler : IRequestHandler<GetProfileQuery, UserDto>
    {
        private readonly IUserRepository _repo;

        public GetProfileHandler(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<UserDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await _repo.GetByIdAsync(request.UserId)
                       ?? throw new Exception("User not found");

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                RoleName = user.Role?.Name ?? "",
                CreatedAt = user.CreatedAt
            };
        }
    }
}