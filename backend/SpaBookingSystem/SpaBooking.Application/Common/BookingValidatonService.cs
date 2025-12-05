using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaBooking.Application.Common
{
    public class BookingValidationService
    {
        // Kiểm tra khoảng thời gian hợp lệ (start < end, không trước hiện tại)
        public List<string> ValidateTimeRange(DateTime startAt, DateTime endAt)
        {
            var errors = new List<string>();

            if (startAt >= endAt)
                errors.Add("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");

            if (startAt < DateTime.UtcNow)
                errors.Add("Thời gian bắt đầu không được trước hiện tại.");

            return errors;
        }

        // Kiểm tra giờ làm việc
        public List<string> ValidateWorkingHours(DateTime startAt, DateTime endAt, int workStartHour = 9, int workEndHour = 17)
        {
            var errors = new List<string>();
            var workStart = startAt.Date.AddHours(workStartHour);
            var workEnd = startAt.Date.AddHours(workEndHour);

            if (startAt < workStart || endAt > workEnd)
                errors.Add($"Khoảng thời gian ngoài giờ làm việc ({workStartHour}:00 - {workEndHour}:00).");

            return errors;
        }

        // Kiểm tra trùng với slot đã có
        public async Task<bool> HasOverlappingSlotAsync(
            Guid staffId,
            DateTime startAt,
            DateTime endAt,
            IQueryable<TimeSlot> existingSlots)
        {
            return await Task.FromResult(
                existingSlots.Any(ts =>
                    ts.StaffId == staffId &&
                    ts.StartAt < endAt &&
                    ts.EndAt > startAt &&
                    ts.BookingId != null)
            );
        }
    }
}