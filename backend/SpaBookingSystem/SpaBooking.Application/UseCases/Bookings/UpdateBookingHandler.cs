using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Common;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Domain.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class UpdateBookingHandler : IRequestHandler<UpdateBookingCommand, bool>
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly ITimeSlotRepository _timeSlotRepo;
        private readonly IServiceRepository _serviceRepo;
        private readonly IPromotionRepository _promotionRepo;
        private readonly BookingValidationService _validation;

        public UpdateBookingHandler(
            IBookingRepository bookingRepo,
            IStaffRepository staffRepo,
            ITimeSlotRepository timeSlotRepo,
            IServiceRepository serviceRepo,
            IPromotionRepository promotionRepo,
            BookingValidationService validation)
        {
            _bookingRepo = bookingRepo;
            _staffRepo = staffRepo;
            _timeSlotRepo = timeSlotRepo;
            _serviceRepo = serviceRepo;
            _promotionRepo = promotionRepo;
            _validation = validation;
        }

        public async Task<bool> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.Query()
                .Include(b => b.TimeSlots)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
            if (booking == null) return false;

            var dto = request.Dto;

            // Lấy Service
            var service = await _serviceRepo.Query()
                .FirstOrDefaultAsync(s => s.Id == dto.ServiceId && s.IsActive, cancellationToken);

            if (service == null)
                throw new Exception("Service not found or inactive.");

            // Tính EndAt nếu cần
            var startAt = dto.StartAt;
            var endAt = dto.EndAt != default ? dto.EndAt : startAt.AddMinutes(service.DurationMinutes);

            // Validate thời gian
            var errors = _validation.ValidateTimeRange(startAt, endAt);
            errors.AddRange(_validation.ValidateWorkingHours(startAt, endAt));
            errors.AddRange(_validation.ValidateDuration(startAt, endAt));
            if (errors.Any())
                throw new Exception(string.Join("; ", errors));

            // Chọn Staff
            Guid staffId;
            if (dto.StaffId.HasValue)
            {
                var staffAvailable = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .FirstOrDefaultAsync(s => s.Id == dto.StaffId.Value && s.IsAvailable, cancellationToken);

                if (staffAvailable == null)
                    throw new Exception("Staff not available.");

                // Kiểm tra conflict với booking khác
                var hasConflict = staffAvailable.TimeSlots.Any(ts =>
                    ts.StartAt < endAt &&
                    ts.EndAt > startAt &&
                    ts.BookingId != null &&
                    ts.BookingId != booking.Id);

                if (hasConflict)
                    throw new Exception("Staff has conflicting booking.");

                staffId = dto.StaffId.Value;
            }
            else
            {
                // Auto-assign staff
                var availableStaff = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .Where(s => s.IsAvailable)
                    .ToListAsync(cancellationToken);

                var candidate = availableStaff.FirstOrDefault(s =>
                    s.TimeSlots.Any(ts =>
                        ts.IsAvailable &&
                        ts.StartAt <= startAt &&
                        ts.EndAt >= endAt));

                if (candidate == null)
                    throw new Exception("No available staff for the requested time.");

                staffId = candidate.Id;
            }

            // Cập nhật TimeSlot
            // Release slot cũ
            foreach (var ts in booking.TimeSlots)
            {
                ts.BookingId = null;
                ts.IsAvailable = true;
                await _timeSlotRepo.UpdateAsync(ts);
            }

            // Tạo slot mới nếu chưa tồn tại
            var slotExists = await _timeSlotRepo.Query()
                .AnyAsync(ts => ts.StaffId == staffId &&
                                ts.StartAt == startAt &&
                                ts.EndAt == endAt &&
                                ts.BookingId != null, cancellationToken);
            if (!slotExists)
            {
                var newSlot = new TimeSlot
                {
                    StaffId = staffId,
                    StartAt = startAt,
                    EndAt = endAt,
                    IsAvailable = true,
                    BookingId = booking.Id
                };
                await _timeSlotRepo.AddAsync(newSlot);
            }
            else
            {
                // Gán slot hiện có cho booking
                var existingSlot = await _timeSlotRepo.Query()
                    .FirstAsync(ts => ts.StaffId == staffId &&
                                      ts.StartAt == startAt &&
                                      ts.EndAt == endAt, cancellationToken);
                existingSlot.BookingId = booking.Id;
                existingSlot.IsAvailable = false;
                await _timeSlotRepo.UpdateAsync(existingSlot);
            }

            // Update booking
            booking.CustomerId = dto.CustomerId;
            booking.ServiceId = dto.ServiceId;
            booking.StaffId = staffId;
            booking.PromotionId = dto.PromotionId;
            booking.StartAt = startAt;
            booking.EndAt = endAt;
            booking.Note = dto.Note;

            if (Enum.TryParse<BookingStatus>(dto.Status, out var status))
                booking.Status = status;

            // Tính lại FinalPrice
            decimal finalPrice = service?.Price ?? booking.FinalPrice;
            Promotion? promotion = null;

            if (dto.PromotionId.HasValue)
            {
                promotion = await _promotionRepo.Query()
                    .FirstOrDefaultAsync(p => p.Id == dto.PromotionId.Value &&
                                              p.IsActive &&
                                              p.StartAt <= DateTime.UtcNow &&
                                              p.EndAt >= DateTime.UtcNow,
                                         cancellationToken);
                if (promotion != null && promotion.DiscountPercent.HasValue)
                {
                    finalPrice = finalPrice * (1 - promotion.DiscountPercent.Value / 100m);
                }
            }

            booking.PromotionId = promotion?.Id;
            booking.FinalPrice = finalPrice;

            await _bookingRepo.UpdateAsync(booking);
            return true;
        }
    }
}