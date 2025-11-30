using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Contracts.DTOs.TimeSlots;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class ValidateTimeSlotRangeHandler : IRequestHandler<ValidateTimeSlotRangeQuery, ValidateTimeSlotRangeResultDto>
    {
        private readonly ITimeSlotRepository _timeSlotRepository;

        public ValidateTimeSlotRangeHandler(ITimeSlotRepository timeSlotRepository)
        {
            _timeSlotRepository = timeSlotRepository;
        }

        public async Task<ValidateTimeSlotRangeResultDto> Handle(ValidateTimeSlotRangeQuery request, CancellationToken cancellationToken)
        {
            var result = new ValidateTimeSlotRangeResultDto();

            // 1. Kiểm tra thời gian hợp lệ
            if (request.StartAt >= request.EndAt)
                result.Errors.Add("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.");

            if (request.StartAt < DateTime.UtcNow)
                result.Errors.Add("Thời gian bắt đầu không được trước hiện tại.");

            // 2. Giờ làm việc mặc định: 9:00 -> 17:00
            var workStart = request.StartAt.Date.AddHours(9);
            var workEnd = request.StartAt.Date.AddHours(17);

            if (request.StartAt < workStart || request.EndAt > workEnd)
                result.Errors.Add("Khoảng thời gian ngoài giờ làm việc (9:00 - 17:00).");

            // 3. Duration chia hết 30 phút
            var durationMinutes = (request.EndAt - request.StartAt).TotalMinutes;
            if (durationMinutes % 30 != 0)
                result.Errors.Add("Khoảng thời gian phải là bội số 30 phút.");

            // 4. Kiểm tra trùng slot đã tồn tại
            var overlapping = await _timeSlotRepository.Query()
                .Where(ts => ts.StaffId == request.StaffId &&
                             ts.StartAt < request.EndAt &&
                             ts.EndAt > request.StartAt)
                .AnyAsync(cancellationToken);

            if (overlapping)
                result.Errors.Add("Khoảng thời gian trùng với slot đã tồn tại.");

            result.IsValid = result.Errors.Count == 0;
            return result;
        }
    }
}