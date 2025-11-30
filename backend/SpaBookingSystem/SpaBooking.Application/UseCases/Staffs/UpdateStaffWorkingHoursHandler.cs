using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.TimeSlots;
using SpaBooking.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class UpdateStaffWorkingHoursHandler : IRequestHandler<UpdateStaffWorkingHoursCommand, List<TimeSlotDto>>
    {
        private readonly IStaffRepository _staffRepository;
        private readonly ITimeSlotRepository _timeSlotRepository;

        public UpdateStaffWorkingHoursHandler(IStaffRepository staffRepository, ITimeSlotRepository timeSlotRepository)
        {
            _staffRepository = staffRepository;
            _timeSlotRepository = timeSlotRepository;
        }

        public async Task<List<TimeSlotDto>> Handle(UpdateStaffWorkingHoursCommand request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return new List<TimeSlotDto>();

            // Xóa các slot cũ chưa có booking
            var oldSlots = staff.TimeSlots.Where(ts => ts.BookingId == null).ToList();
            foreach (var ts in oldSlots)
            {
                await _timeSlotRepository.DeleteAsync(ts);
            }

            // Tạo slot mới
            var newSlots = request.Slots.Select(s => new TimeSlot
            {
                StaffId = staff.Id,
                StartAt = s.StartAt,
                EndAt = s.EndAt,
                IsAvailable = true
            }).ToList();

            foreach (var ts in newSlots)
            {
                await _timeSlotRepository.AddAsync(ts);
            }

            return newSlots.Select(ts => new TimeSlotDto
            {
                Id = ts.Id,
                StaffId = ts.StaffId,
                StartAt = ts.StartAt,
                EndAt = ts.EndAt,
                IsAvailable = ts.IsAvailable
            }).ToList();
        }
    }
}