using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class GetBookingsByDateHandler : IRequestHandler<GetBookingsByDateQuery, List<BookingDto>>
    {
        private readonly IBookingRepository _bookingRepo;

        public GetBookingsByDateHandler(IBookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        public async Task<List<BookingDto>> Handle(GetBookingsByDateQuery request, CancellationToken cancellationToken)
        {
            var query = _bookingRepo.Query()
                .Where(b => b.StartAt.Date <= request.Date && b.EndAt.Date >= request.Date);

            if (request.StaffId.HasValue)
                query = query.Where(b => b.StaffId == request.StaffId.Value);

            if (request.ServiceId.HasValue)
                query = query.Where(b => b.ServiceId == request.ServiceId.Value);

            if (!string.IsNullOrEmpty(request.Status))
            {
                if (Enum.TryParse<BookingStatus>(request.Status, out var status))
                    query = query.Where(b => b.Status == status);
            }

            var bookings = await query.OrderBy(b => b.StartAt).ToListAsync(cancellationToken);

            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                ServiceId = b.ServiceId,
                StaffId = b.StaffId,
                PromotionId = b.PromotionId,
                FinalPrice = b.FinalPrice,
                StartAt = b.StartAt,
                EndAt = b.EndAt,
                CreatedAt = b.CreatedAt,
                Note = b.Note,
                Status = b.Status.ToString()
            }).ToList();
        }
    }
}