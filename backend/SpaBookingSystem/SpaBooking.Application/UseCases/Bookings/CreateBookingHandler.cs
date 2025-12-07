using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Common;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class CreateBookingHandler : IRequestHandler<CreateBookingCommand, BookingDto>
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly ITimeSlotRepository _timeSlotRepo;
        private readonly IServiceRepository _serviceRepo;
        private readonly IPromotionRepository _promotionRepo;
        private readonly BookingValidationService _validation;

        public CreateBookingHandler(
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

        public async Task<BookingDto> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;

            // Lấy service
            var service = await _serviceRepo.Query()
                .FirstOrDefaultAsync(s => s.Id == dto.ServiceId && s.IsActive, cancellationToken);

            if (service == null)
                throw new Exception("Service not found or inactive.");

            // Tính giá cuối cùng với khuyến mãi (nếu có)
            Promotion? promotion = null;
            decimal finalPrice = service.Price;

            if (dto.PromotionId.HasValue)
            {
                promotion = await _promotionRepo.Query()
                    .FirstOrDefaultAsync(p => p.Id == dto.PromotionId.Value &&
                                              p.IsActive &&
                                              p.StartAt <= DateTime.UtcNow &&
                                              p.EndAt >= DateTime.UtcNow,
                                         cancellationToken);
                if (promotion != null)
                {
                    if (promotion.DiscountPercent.HasValue)
                    {
                        finalPrice = service.Price * (1 - promotion.DiscountPercent.Value / 100m);
                    }
                    else if (promotion.DiscountAmount.HasValue)
                    {
                        finalPrice = service.Price - promotion.DiscountAmount.Value;
                    }

                    if (finalPrice < 0)
                        finalPrice = 0;
                }
            }

            // Tính EndAt dựa trên service duration nếu chưa truyền
            var startAt = dto.StartAt;
            var endAt = dto.EndAt != default ? dto.EndAt : startAt.AddMinutes(service.DurationMinutes);

            var timeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // GMT+7
            var startLocal = TimeZoneInfo.ConvertTimeFromUtc(startAt, timeZone);
            var endLocal = TimeZoneInfo.ConvertTimeFromUtc(endAt, timeZone);

            // Validate thời gian
            var errors = _validation.ValidateTimeRange(startLocal, endLocal);
            errors.AddRange(_validation.ValidateWorkingHours(startLocal, endLocal));

            if (errors.Any())
                throw new Exception(string.Join("; ", errors));

            // Chọn staff
            Guid staffId;
            if (dto.StaffId.HasValue)
            {
                // Kiểm tra staff availability
                var staffAvailable = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .FirstOrDefaultAsync(s => s.Id == dto.StaffId.Value && s.IsAvailable, cancellationToken);

                if (staffAvailable == null)
                    throw new Exception("Staff not available.");

                var conflict = staffAvailable.TimeSlots.Any(ts =>
                    ts.StartAt < endAt &&
                    ts.EndAt > startAt &&
                    ts.BookingId != null);

                if (conflict)
                    throw new Exception("Staff has conflicting booking.");

                staffId = dto.StaffId.Value;
            }
            else
            {
                // Auto-assign staff: tìm staff có slot khả dụng
                var candidate = await _staffRepo.Query()
                    .Include(s => s.TimeSlots)
                    .Where(s => s.IsAvailable)
                    .FirstOrDefaultAsync(s =>
                        s.TimeSlots.Any(ts =>
                            ts.IsAvailable &&
                            ts.StartAt <= startAt &&
                            ts.EndAt >= endAt),
                        cancellationToken);

                if (candidate == null)
                    throw new Exception("No available staff for the requested time.");

                staffId = candidate.Id;
            }

            // Kiểm tra slot và xung đột booking
            var overlapping = await _validation.HasOverlappingSlotAsync(staffId, startAt, endAt, _timeSlotRepo.Query());
            if (overlapping)
                throw new Exception("Slot already booked.");

            // Tạo booking trước
            var booking = new Booking
            {
                CustomerId = dto.CustomerId,
                ServiceId = service.Id,
                StaffId = staffId,
                PromotionId = dto.PromotionId,
                FinalPrice = finalPrice,
                StartAt = startAt,
                EndAt = endAt,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                await _bookingRepo.AddAsync(booking);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Booking AddAsync failed: " + ex);
                throw;
            }

            // Tạo slot gắn cho booking mới
            var slotExists = await _timeSlotRepo.Query()
                .Where(ts => ts.StaffId == staffId &&
                             ts.StartAt == startAt &&
                             ts.EndAt == endAt)
                .AnyAsync(cancellationToken);

            if (!slotExists)
            {
                var slot = new TimeSlot
                {
                    StaffId = staffId,
                    BookingId = booking.Id,
                    StartAt = startAt,
                    EndAt = endAt,
                    IsAvailable = false           // slot đã book rồi
                };

                await _timeSlotRepo.AddAsync(slot);
            }
            else
            {
                // Nếu đã tồn tại slot thì cập nhật BookingId
                var existingSlot = await _timeSlotRepo.Query()
                    .FirstAsync(ts =>
                        ts.StaffId == staffId &&
                        ts.StartAt == startAt &&
                        ts.EndAt == endAt,
                        cancellationToken);

                existingSlot.BookingId = booking.Id;
                existingSlot.IsAvailable = false;

                await _timeSlotRepo.UpdateAsync(existingSlot);
            }

            return new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                ServiceId = booking.ServiceId,
                StaffId = booking.StaffId,
                PromotionId = booking.PromotionId,
                StartAt = booking.StartAt,
                EndAt = booking.EndAt,
                CreatedAt = booking.CreatedAt,
                Note = booking.Note,
                Status = booking.Status.ToString()
            };
        }
    }
}