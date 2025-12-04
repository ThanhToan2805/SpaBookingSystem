using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Contracts.DTOs.TimeSlots;
using SpaBooking.Application.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class ValidateTimeSlotRangeHandler : IRequestHandler<ValidateTimeSlotRangeQuery, ValidateTimeSlotRangeResultDto>
    {
        private readonly ITimeSlotRepository _timeSlotRepository;
        private readonly BookingValidationService _validation;

        public ValidateTimeSlotRangeHandler(ITimeSlotRepository timeSlotRepository, BookingValidationService validation)
        {
            _timeSlotRepository = timeSlotRepository;
            _validation = validation;
        }

        public async Task<ValidateTimeSlotRangeResultDto> Handle(ValidateTimeSlotRangeQuery request, CancellationToken cancellationToken)
        {
            var result = new ValidateTimeSlotRangeResultDto();

            var errors = _validation.ValidateTimeRange(request.StartAt, request.EndAt);
            errors.AddRange(_validation.ValidateWorkingHours(request.StartAt, request.EndAt));
            errors.AddRange(_validation.ValidateDuration(request.StartAt, request.EndAt));

            var overlapping = await _validation.HasOverlappingSlotAsync(request.StaffId, request.StartAt, request.EndAt, _timeSlotRepository.Query());
            if (overlapping)
                errors.Add("Khoảng thời gian trùng với slot đã tồn tại.");

            result.Errors = errors;
            result.IsValid = !errors.Any();

            return result;
        }
    }
}