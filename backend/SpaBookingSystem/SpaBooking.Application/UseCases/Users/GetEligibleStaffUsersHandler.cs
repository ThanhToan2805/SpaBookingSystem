using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Users;
using SpaBooking.Contracts.DTOs.Users;

namespace SpaBooking.Application.UseCases.Users
{
    public class GetEligibleStaffUsersHandler
        : IRequestHandler<GetEligibleStaffUsersQuery, List<EligibleStaffUserDto>>
    {
        private readonly IUserRepository _userRepo;
        private readonly IStaffRepository _staffRepo;

        public GetEligibleStaffUsersHandler(IUserRepository userRepo, IStaffRepository staffRepo)
        {
            _userRepo = userRepo;
            _staffRepo = staffRepo;
        }

        public async Task<List<EligibleStaffUserDto>> Handle(
            GetEligibleStaffUsersQuery request,
            CancellationToken cancellationToken)
        {
            // User role = Staff, và chưa tồn tại Staff(UserId = User.Id)
            // (User có Role navigation) :contentReference[oaicite:3]{index=3}

            var query =
                from u in _userRepo.Query()
                where u.Role.Name == "Staff"
                where !_staffRepo.Query().Any(s => s.UserId == u.Id) // Staff.UserId :contentReference[oaicite:4]{index=4}
                orderby u.Username
                select new EligibleStaffUserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    FullName = u.FullName
                };

            return await query.ToListAsync(cancellationToken);
        }
    }
}