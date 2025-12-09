using MediatR;
using SpaBooking.Application.Interfaces;
using SpaBooking.Application.Common.Exceptions;
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
                throw new ConflictException("Email đã được đăng ký");

            var isUsernameExists = await _userRepository.GetByUsernameAsync(request.Username);
            if (isUsernameExists != null)
                throw new ConflictException("Username đã được đăng ký");

            var userRole = await _roleRepository.GetByNameAsync("Customer")
                           ?? throw new NotFoundException("Default role not found");

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