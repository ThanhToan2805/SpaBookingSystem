using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetStaffUtilizationHandler : IRequestHandler<GetStaffUtilizationQuery, StaffUtilizationDto?>
    {
        private readonly IStaffRepository _staffRepository;

        public GetStaffUtilizationHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<StaffUtilizationDto?> Handle(GetStaffUtilizationQuery request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return null;

            var timeSlots = staff.TimeSlots.AsQueryable();

            if (request.From.HasValue)
                timeSlots = timeSlots.Where(ts => ts.StartAt.Date >= request.From.Value.Date);

            if (request.To.HasValue)
                timeSlots = timeSlots.Where(ts => ts.EndAt.Date <= request.To.Value.Date);

            int totalSlots = timeSlots.Count();
            int bookedSlots = timeSlots.Count(ts => ts.BookingId != null);

            double utilizationPercent = totalSlots == 0 ? 0 : (double)bookedSlots / totalSlots * 100;

            return new StaffUtilizationDto
            {
                StaffId = staff.Id,
                StaffName = staff.User.Username,
                TotalSlots = totalSlots,
                BookedSlots = bookedSlots,
                UtilizationPercent = utilizationPercent
            };
        }
    }
}