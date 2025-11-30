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
    public class GetTimeSlotsByStaffHandler : IRequestHandler<GetTimeSlotsByStaffQuery, List<TimeSlotDto>>
    {
        private readonly ITimeSlotRepository _timeSlotRepository;

        public GetTimeSlotsByStaffHandler(ITimeSlotRepository timeSlotRepository)
        {
            _timeSlotRepository = timeSlotRepository;
        }

        public async Task<List<TimeSlotDto>> Handle(GetTimeSlotsByStaffQuery request, CancellationToken cancellationToken)
        {
            var query = _timeSlotRepository.Query()
                .Include(ts => ts.Booking)
                .Where(ts => ts.StaffId == request.StaffId);

            if (request.From.HasValue)
                query = query.Where(ts => ts.EndAt >= request.From.Value);

            if (request.To.HasValue)
                query = query.Where(ts => ts.StartAt <= request.To.Value);

            var slots = await query.OrderBy(ts => ts.StartAt).ToListAsync(cancellationToken);

            return slots.Select(ts => new TimeSlotDto
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
            }).ToList();
        }
    }
}