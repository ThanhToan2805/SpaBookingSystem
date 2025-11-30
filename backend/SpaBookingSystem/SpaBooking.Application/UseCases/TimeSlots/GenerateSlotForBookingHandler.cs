using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Contracts.DTOs.TimeSlots;
using SpaBooking.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class GenerateSlotForBookingHandler : IRequestHandler<GenerateSlotForBookingCommand, List<TimeSlotGroupDto>>
    {
        private readonly ITimeSlotRepository _timeSlotRepository;

        public GenerateSlotForBookingHandler(ITimeSlotRepository timeSlotRepository)
        {
            _timeSlotRepository = timeSlotRepository;
        }

        public async Task<List<TimeSlotGroupDto>> Handle(GenerateSlotForBookingCommand request, CancellationToken cancellationToken)
        {
            var slotDuration = TimeSpan.FromMinutes(30);
            var slotsNeeded = (int)Math.Ceiling(request.ServiceDurationMinutes / 30.0);

            var workStart = request.DesiredDate.Date.AddHours(9);
            var workEnd = request.DesiredDate.Date.AddHours(17);
            var now = DateTime.UtcNow;

            // Lấy slot đã tồn tại (lịch sử) cho staff và ngày đó
            var existingSlots = await _timeSlotRepository.Query()
                .Where(ts => ts.StaffId == request.StaffId && ts.StartAt.Date == request.DesiredDate.Date)
                .OrderBy(ts => ts.StartAt)
                .ToListAsync();

            var generatedGroups = new List<TimeSlotGroupDto>();
            var start = workStart;

            while (start + slotDuration * slotsNeeded <= workEnd)
            {
                bool conflict = false;
                var tempSlots = new List<TimeSlot>();

                for (int i = 0; i < slotsNeeded; i++)
                {
                    var slotStart = start + slotDuration * i;
                    var slotEnd = slotStart + slotDuration;

                    // Slot trùng lịch sử hoặc trôi qua giờ hiện tại → conflict
                    if (slotStart < now || existingSlots.Any(s => s.StartAt == slotStart))
                    {
                        conflict = true;
                        break;
                    }

                    tempSlots.Add(new TimeSlot
                    {
                        StaffId = request.StaffId,
                        StartAt = slotStart,
                        EndAt = slotEnd,
                        IsAvailable = true
                    });
                }

                if (!conflict)
                {
                    // Tạo slot mới trong DB
                    foreach (var ts in tempSlots)
                        await _timeSlotRepository.AddAsync(ts);

                    // Thêm nhóm slot vào kết quả
                    generatedGroups.Add(new TimeSlotGroupDto
                    {
                        Slots = tempSlots.Select(ts => new TimeSlotDto
                        {
                            Id = ts.Id,
                            StaffId = ts.StaffId,
                            StartAt = ts.StartAt,
                            EndAt = ts.EndAt,
                            IsAvailable = ts.IsAvailable
                        }).ToList()
                    });
                }

                start += slotDuration; // Dịch sang slot tiếp theo
            }

            return generatedGroups;
        }
    }
}