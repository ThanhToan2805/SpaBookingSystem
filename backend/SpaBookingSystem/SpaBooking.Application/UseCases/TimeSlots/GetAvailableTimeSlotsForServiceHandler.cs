using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class GetAvailableTimeSlotsForServiceHandler : IRequestHandler<GetAvailableTimeSlotsForServiceQuery, List<TimeSlotDto>>
    {
        private readonly ITimeSlotRepository _timeSlotRepository;
        private readonly IStaffRepository _staffRepository;

        public GetAvailableTimeSlotsForServiceHandler(
            ITimeSlotRepository timeSlotRepository,
            IStaffRepository staffRepository)
        {
            _timeSlotRepository = timeSlotRepository;
            _staffRepository = staffRepository;
        }

        public async Task<List<TimeSlotDto>> Handle(GetAvailableTimeSlotsForServiceQuery request, CancellationToken cancellationToken)
        {
            // Lấy staff
            var staff = await _staffRepository.Query()
                .Include(s => s.TimeSlots)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId && s.IsAvailable, cancellationToken);

            if (staff == null) return new List<TimeSlotDto>();

            // Lọc slot rảnh trong khoảng StartAt → EndAt
            var availableSlots = staff.TimeSlots
                .Where(ts =>
                    ts.IsAvailable &&
                    ts.StartAt >= request.StartAt &&
                    ts.EndAt <= request.EndAt)
                .OrderBy(ts => ts.StartAt)
                .Select(ts => new TimeSlotDto
                {
                    Id = ts.Id,
                    StaffId = ts.StaffId,
                    StartAt = ts.StartAt,
                    EndAt = ts.EndAt,
                    IsAvailable = ts.IsAvailable,
                    Booking = ts.Booking != null ? new BookingInfoDto
                    {
                        Id = ts.Booking.Id,
                        CustomerId = ts.Booking.CustomerId,
                        ServiceId = ts.Booking.ServiceId,
                        Note = ts.Booking.Note,
                        Status = ts.Booking.Status.ToString()
                    } : null
                })
                .ToList();

            return availableSlots;
        }
    }
}