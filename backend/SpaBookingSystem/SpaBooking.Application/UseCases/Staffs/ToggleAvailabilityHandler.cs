using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class ToggleAvailabilityHandler : IRequestHandler<ToggleAvailabilityCommand, StaffDto?>
    {
        private readonly IStaffRepository _staffRepository;

        public ToggleAvailabilityHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<StaffDto?> Handle(ToggleAvailabilityCommand request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return null;

            staff.IsAvailable = request.IsAvailable;

            await _staffRepository.UpdateAsync(staff);

            return new StaffDto
            {
                Id = staff.Id,
                UserId = staff.UserId,
                Position = staff.Position,
                IsAvailable = staff.IsAvailable,
                UserName = staff.User.Username
            };
        }
    }
}