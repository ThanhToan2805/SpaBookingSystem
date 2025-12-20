using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class GetAvailableSlotsHandler : IRequestHandler<GetAvailableSlotsQuery, List<AvailableSlotDto>>
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IServiceRepository _serviceRepo;

        public GetAvailableSlotsHandler(IBookingRepository bookingRepo, IServiceRepository serviceRepo)
        {
            _bookingRepo = bookingRepo;
            _serviceRepo = serviceRepo;
        }

        public async Task<List<AvailableSlotDto>> Handle(GetAvailableSlotsQuery request, CancellationToken cancellationToken)
        {
            // 1) lấy duration của service
            var service = await _serviceRepo.GetByIdAsync(request.ServiceId);
            if (service == null) return new List<AvailableSlotDto>();

            var duration = service.DurationMinutes;

            // 2) xác định khoảng thời gian làm việc trong ngày
            var day = request.Date.Date;
            var dayStart = day.AddHours(request.OpenHour);
            var dayEnd = day.AddHours(request.CloseHour);

            var dayLocal = DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Unspecified);

            // Giờ làm theo VN
            var openLocal = dayLocal.AddHours(request.OpenHour);
            var closeLocal = dayLocal.AddHours(request.CloseHour);

            // Convert sang UTC (VN = +07:00)
            var offset = TimeSpan.FromHours(7);
            var dayStartUtc = new DateTimeOffset(openLocal, offset).UtcDateTime;
            var dayEndUtc = new DateTimeOffset(closeLocal, offset).UtcDateTime;

            // 3) lấy các booking bận trong ngày (lọc staff nếu có)
            var busyQuery = _bookingRepo.Query()
                .Where(b => b.Status != BookingStatus.Cancelled)
                .Where(b => b.StartAt < dayEndUtc && b.EndAt > dayStartUtc);

            if (request.StaffId.HasValue)
                busyQuery = busyQuery.Where(b => b.StaffId == request.StaffId.Value);

            var busyBookings = await busyQuery
                .Select(b => new { b.StartAt, b.EndAt })
                .ToListAsync(cancellationToken);

            // 4) sinh slot và lọc trùng
            var results = new List<AvailableSlotDto>();
            for (var t = dayStartUtc; t.AddMinutes(duration) <= dayEndUtc; t = t.AddMinutes(request.StepMinutes))
            {
                var slotStart = t;
                var slotEnd = t.AddMinutes(duration);

                // optional: loại giờ đã qua (dùng giờ server)
                if (slotStart <= DateTime.Now) continue;

                var isBusy = busyBookings.Any(b =>
                    slotStart < b.EndAt && slotEnd > b.StartAt
                );

                if (!isBusy)
                {
                    results.Add(new AvailableSlotDto
                    {
                        StartAt = slotStart,
                        EndAt = slotEnd
                    });
                }
            }

            return results;
        }
    }
}