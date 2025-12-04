using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class CompleteBookingHandler : IRequestHandler<CompleteBookingCommand, bool>
    {
        private readonly IBookingRepository _bookingRepo;

        public CompleteBookingHandler(
            IBookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        public async Task<bool> Handle(CompleteBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);
            if (booking == null) return false;

            // Cập nhật trạng thái
            booking.Status = BookingStatus.Completed;
            if (!string.IsNullOrEmpty(request.Note))
                booking.Note = request.Note;

            await _bookingRepo.UpdateAsync(booking);

            return true;
        }
    }
}