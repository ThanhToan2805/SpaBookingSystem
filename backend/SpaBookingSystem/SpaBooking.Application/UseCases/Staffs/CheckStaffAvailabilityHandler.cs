using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class CheckStaffAvailabilityHandler : IRequestHandler<CheckStaffAvailabilityQuery, bool>
    {
        private readonly IStaffRepository _staffRepository;

        public CheckStaffAvailabilityHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<bool> Handle(CheckStaffAvailabilityQuery request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId && s.IsAvailable, cancellationToken);

            if (staff == null) return false;

            // Kiểm tra có ít nhất 1 slot khả dụng bao phủ toàn bộ khoảng StartAt → EndAt
            var isAvailable = staff.TimeSlots.Any(ts =>
                ts.IsAvailable &&
                ts.StartAt <= request.StartAt &&
                ts.EndAt >= request.EndAt);

            return isAvailable;
        }
    }
}