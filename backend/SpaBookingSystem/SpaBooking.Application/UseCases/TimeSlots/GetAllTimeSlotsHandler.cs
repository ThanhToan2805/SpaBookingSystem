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
    public class GetAllTimeSlotsHandler : IRequestHandler<GetAllTimeSlotsQuery, IEnumerable<TimeSlotDto>>
    {
        private readonly ITimeSlotRepository _repository;

        public GetAllTimeSlotsHandler(ITimeSlotRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TimeSlotDto>> Handle(GetAllTimeSlotsQuery request, CancellationToken cancellationToken)
        {
            var query = _repository.Query();

            if (request.StaffId.HasValue)
                query = query.Where(t => t.StaffId == request.StaffId.Value);

            var entities = await query.ToListAsync(cancellationToken);

            return entities.Select(t => new TimeSlotDto
            {
                Id = t.Id,
                StaffId = t.StaffId,
                StartAt = t.StartAt,
                EndAt = t.EndAt,
                IsAvailable = t.IsAvailable,
                Booking = t.Booking == null ? null : new BookingInfoDto
                {
                    Id = t.Booking.Id,
                    CustomerId = t.Booking.CustomerId,
                    ServiceId = t.Booking.ServiceId,
                    Note = t.Booking.Note,
                    Status = t.Booking.Status.ToString()
                }
            }).ToList();
        }
    }
}