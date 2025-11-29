using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.UseCases.Users
{
    public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand, UserDto>
    {
        private readonly IUserRepository _repo;

        public UpdateProfileHandler(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<UserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _repo.GetByIdAsync(request.UserId)
                       ?? throw new Exception("User not found");

            // Update fields
            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;

            await _repo.SaveChangesAsync();

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