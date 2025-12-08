using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Interfaces.Notifications;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class RescheduleBookingHandler : IRequestHandler<RescheduleBookingCommand, BookingDto>
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly ITimeSlotRepository _timeSlotRepo;
        private readonly IServiceRepository _serviceRepo;
        private readonly IBookingNotificationService _notification;

        public RescheduleBookingHandler(
            IBookingRepository bookingRepo,
            IStaffRepository staffRepo,
            ITimeSlotRepository timeSlotRepo,
            IServiceRepository serviceRepo,
            IBookingNotificationService notification)
        {
            _bookingRepo = bookingRepo;
            _staffRepo = staffRepo;
            _timeSlotRepo = timeSlotRepo;
            _serviceRepo = serviceRepo;
            _notification = notification;
        }

        public async Task<BookingDto> Handle(RescheduleBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);
            if (booking == null)
                throw new Exception("Booking not found.");

            // Lấy service để tính EndAt
            var service = await _serviceRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == booking.ServiceId && s.IsActive, cancellationToken);

            if (service == null)
                throw new Exception("Associated service not found or inactive.");

            var newStart = request.NewStartAt;
            var newEnd = newStart.AddMinutes(service.DurationMinutes);

            // Lấy hoặc gán staff
            Guid staffId;
            if (request.StaffId.HasValue)
            {
                var staff = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Id == request.StaffId.Value && s.IsAvailable, cancellationToken);

                if (staff == null)
                    throw new Exception("Staff not available.");

                // Check conflict
                if (staff.TimeSlots.Any(ts => ts.StartAt < newEnd && ts.EndAt > newStart && ts.BookingId != null))
                    throw new Exception("Staff has conflicting booking.");

                staffId = request.StaffId.Value;
            }
            else
            {
                // Auto-assign staff
                var availableStaff = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .AsNoTracking()
                    .Where(s => s.IsAvailable)
                    .ToListAsync(cancellationToken);

                var candidate = availableStaff.FirstOrDefault(s =>
                    s.TimeSlots.Any(ts =>
                        ts.IsAvailable &&
                        ts.StartAt <= newStart &&
                        ts.EndAt >= newEnd));

                if (candidate == null)
                    throw new Exception("No available staff for the requested time.");

                staffId = candidate.Id;
            }

            // Giải phóng slot cũ
            var oldSlot = await _timeSlotRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(ts => ts.BookingId == booking.Id, cancellationToken);

            if (oldSlot != null)
            {
                oldSlot.IsAvailable = true;
                oldSlot.BookingId = null;

                await _timeSlotRepo.UpdateAsync(oldSlot);
            }

            // Cập nhật booking
            booking.StartAt = newStart;
            booking.EndAt = newEnd;
            booking.StaffId = staffId;

            await _bookingRepo.UpdateAsync(booking);

            // Kiểm tra slot mới
            var newSlot = await _timeSlotRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(ts =>
                    ts.StaffId == staffId &&
                    ts.StartAt == newStart &&
                    ts.EndAt == newEnd,
                    cancellationToken);

            if (newSlot != null)
            {
                // Slot đã tồn tại → dùng lại
                if (!newSlot.IsAvailable)
                    throw new Exception("New timeslot is already occupied.");

                newSlot.IsAvailable = false;
                newSlot.BookingId = booking.Id;

                await _timeSlotRepo.UpdateAsync(newSlot);
            }
            else
            {
                // Tạo slot mới
                var createdSlot = new TimeSlot
                {
                    StaffId = staffId,
                    StartAt = newStart,
                    EndAt = newEnd,
                    IsAvailable = false,
                    BookingId = booking.Id
                };

                await _timeSlotRepo.AddAsync(createdSlot);
            }

            await _notification.BookingRescheduledAsync(booking);

            // Trả về BookingDto
            return new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                ServiceId = booking.ServiceId,
                StaffId = booking.StaffId,
                PromotionId = booking.PromotionId,
                FinalPrice = booking.FinalPrice,
                StartAt = booking.StartAt,
                EndAt = booking.EndAt,
                CreatedAt = booking.CreatedAt,
                Note = booking.Note,
                Status = booking.Status.ToString()
            };
        }
    }
}