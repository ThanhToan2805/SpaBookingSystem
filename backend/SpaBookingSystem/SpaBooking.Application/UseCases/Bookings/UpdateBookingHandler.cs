using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class UpdateBookingHandler : IRequestHandler<UpdateBookingCommand, bool>
    {
        private readonly IBookingRepository _repo;

        public UpdateBookingHandler(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(UpdateBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _repo.GetByIdAsync(request.Id);
            if (booking == null) return false;

            var dto = request.Dto;

            booking.CustomerId = dto.CustomerId;
            booking.ServiceId = dto.ServiceId;
            booking.StaffId = dto.StaffId;
            booking.StartAt = dto.StartAt;
            booking.EndAt = dto.EndAt;
            booking.Note = dto.Note;

            if (Enum.TryParse<BookingStatus>(dto.Status, out var status))
                booking.Status = status;

            await _repo.UpdateAsync(booking);
            return true;
        }
    }
}