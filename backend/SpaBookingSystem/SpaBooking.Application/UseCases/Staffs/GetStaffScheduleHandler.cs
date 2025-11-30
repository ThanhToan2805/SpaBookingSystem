using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetStaffScheduleHandler : IRequestHandler<GetStaffScheduleQuery, List<StaffScheduleDto>>
    {
        private readonly IStaffRepository _staffRepository;

        public GetStaffScheduleHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<List<StaffScheduleDto>> Handle(GetStaffScheduleQuery request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)   // join TimeSlots
                .Include(s => s.User)        // lấy Username
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return new List<StaffScheduleDto>();

            var timeSlots = staff.TimeSlots.AsQueryable();

            if (request.Date.HasValue)
            {
                var date = request.Date.Value.Date;
                timeSlots = timeSlots.Where(ts => ts.StartAt.Date == date);
            }

            var result = timeSlots.Select(ts => new StaffScheduleDto
            {
                StaffId = staff.Id,
                StaffName = staff.User.Username,
                StartTime = ts.StartAt,
                EndTime = ts.EndAt,
                IsBooked = ts.BookingId != null
            }).ToList();

            return result;
        }
    }
}