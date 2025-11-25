using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class GetAllBookingsHandler : IRequestHandler<GetAllBookingsQuery, IEnumerable<BookingDto>>
    {
        private readonly IBookingRepository _repo;

        public GetAllBookingsHandler(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<BookingDto>> Handle(GetAllBookingsQuery request, CancellationToken cancellationToken)
        {
            var list = await _repo.Query().ToListAsync(cancellationToken);

            return list.Select(b => new BookingDto
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                ServiceId = b.ServiceId,
                StaffId = b.StaffId,
                StartAt = b.StartAt,
                EndAt = b.EndAt,
                Status = b.Status.ToString(),
                CreatedAt = b.CreatedAt,
                Note = b.Note
            });
        }
    }
}