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

            var existingUsername = await _repo.GetByUsernameAsync(request.Username);
            if (existingUsername != null && existingUsername.Id != user.Id)
                throw new Exception("Username already exists");

            var existingEmail = await _repo.GetByEmailAsync(request.Email);
            if (existingEmail != null && existingEmail.Id != user.Id)
                throw new Exception("Email already exists");

            // Update fields
            user.Username = request.Username;
            user.FullName = request.FullName;
            user.Email = request.Email;
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