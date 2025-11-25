using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class GetBookingByIdHandler : IRequestHandler<GetBookingByIdQuery, BookingDto?>
    {
        private readonly IBookingRepository _repo;

        public GetBookingByIdHandler(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<BookingDto?> Handle(GetBookingByIdQuery request, CancellationToken cancellationToken)
        {
            var b = await _repo.GetByIdAsync(request.Id);
            if (b == null) return null;

            return new BookingDto
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
            };
        }
    }
}