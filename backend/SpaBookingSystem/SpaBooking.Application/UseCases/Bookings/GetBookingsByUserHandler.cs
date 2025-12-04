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
    public class GetBookingsByUserHandler : IRequestHandler<GetBookingsByUserQuery, List<BookingDto>>
    {
        private readonly IBookingRepository _bookingRepo;

        public GetBookingsByUserHandler(IBookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        public async Task<List<BookingDto>> Handle(GetBookingsByUserQuery request, CancellationToken cancellationToken)
        {
            var query = _bookingRepo.Query()
                .Where(b => b.CustomerId == request.UserId);

            if (request.From.HasValue)
                query = query.Where(b => b.StartAt >= request.From.Value);

            if (request.To.HasValue)
                query = query.Where(b => b.EndAt <= request.To.Value);

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