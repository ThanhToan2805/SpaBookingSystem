using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class FindAvailableStaffHandler : IRequestHandler<FindAvailableStaffQuery, List<StaffDto>>
    {
        private readonly IStaffRepository _staffRepository;

        public FindAvailableStaffHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<List<StaffDto>> Handle(FindAvailableStaffQuery request, CancellationToken cancellationToken)
        {
            // Lấy tất cả staff khả dụng
            var staffQuery = _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .Include(s => s.User)
                .Where(s => s.IsAvailable);

            if (!string.IsNullOrEmpty(request.Position))
            {
                staffQuery = staffQuery.Where(s => s.Position == request.Position);
            }

            var staffList = await staffQuery.ToListAsync(cancellationToken);

            // Kiểm tra từng staff có slot trống trong khoảng thời gian
            var availableStaff = staffList
                .Where(s => s.TimeSlots.Any(ts =>
                    ts.IsAvailable &&
                    ts.StartAt <= request.StartAt &&
                    ts.EndAt >= request.EndAt))
                .Select(s => new StaffDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    Position = s.Position,
                    IsAvailable = s.IsAvailable,
                    UserName = s.User.Username
                })
                .ToList();

            return availableStaff;
        }
    }
}