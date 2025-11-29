using MediatR;
using SpaBooking.Application.Interfaces;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using SpaBooking.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace SpaBooking.Application.UseCases.Users
{
    public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, Guid>
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public RegisterUserHandler(IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        public async Task<Guid> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
        {
            var isEmailExists = await _userRepository.GetByEmailAsync(request.Email);
            if (isEmailExists != null)
                throw new Exception("Email already exists");

            var isUsernameExists = await _userRepository.GetByUsernameAsync(request.Username);
            if (isUsernameExists != null)
                throw new Exception("Username already exists");

            var userRole = await _roleRepository.GetByNameAsync("Customer")
                           ?? throw new Exception("Default role not found");

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = BC.HashPassword(request.Password),
                RoleId = userRole.Id
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return user.Id;
        }
    }
}