using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class CreateBookingHandler : IRequestHandler<CreateBookingCommand, BookingDto>
    {
        private readonly IBookingRepository _repo;

        public CreateBookingHandler(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<BookingDto> Handle(CreateBookingCommand request, CancellationToken cancellationToken)
        {
            var dto = request.Dto;

            var booking = new Booking
            {
                CustomerId = dto.CustomerId,
                ServiceId = dto.ServiceId,
                StaffId = dto.StaffId,
                StartAt = dto.StartAt,
                EndAt = dto.EndAt,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(booking);

            return new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                ServiceId = booking.ServiceId,
                StaffId = booking.StaffId,
                StartAt = booking.StartAt,
                EndAt = booking.EndAt,
                CreatedAt = booking.CreatedAt,
                Note = booking.Note,
                Status = booking.Status.ToString()
            };
        }
    }
}