using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetStaffWorkingHoursHandler : IRequestHandler<GetStaffWorkingHoursQuery, List<StaffWorkingHoursDto>>
    {
        private readonly IStaffRepository _staffRepository;

        public GetStaffWorkingHoursHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<List<StaffWorkingHoursDto>> Handle(GetStaffWorkingHoursQuery request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return new List<StaffWorkingHoursDto>();

            var timeSlots = staff.TimeSlots.AsQueryable();

            if (request.From.HasValue)
                timeSlots = timeSlots.Where(ts => ts.StartAt.Date >= request.From.Value.Date);

            if (request.To.HasValue)
                timeSlots = timeSlots.Where(ts => ts.EndAt.Date <= request.To.Value.Date);

            // Group theo ngày
            var grouped = timeSlots
                .GroupBy(ts => ts.StartAt.Date)
                .Select(g => new StaffWorkingHoursDto
                {
                    StaffId = staff.Id,
                    StaffName = staff.User.Username,
                    Date = g.Key,
                    TotalSlots = g.Count(),
                    BookedSlots = g.Count(ts => ts.BookingId != null),
                    TotalHours = g.Sum(ts => (ts.EndAt - ts.StartAt).TotalHours)
                }).ToList();

            return grouped;
        }
    }
}