using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class CancelBookingHandler : IRequestHandler<CancelBookingCommand, bool>
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly ITimeSlotRepository _timeSlotRepo;

        public CancelBookingHandler(IBookingRepository bookingRepo, ITimeSlotRepository timeSlotRepo)
        {
            _bookingRepo = bookingRepo;
            _timeSlotRepo = timeSlotRepo;
        }

        public async Task<bool> Handle(CancelBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);
            if (booking == null) return false;

            // Chỉ hủy khi chưa Completed hoặc NoShow
            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.NoShow)
                return false;

            // Giải phóng slot liên quan
            var slot = await _timeSlotRepo.Query()
                .AsNoTracking()
                .FirstOrDefaultAsync(ts => ts.BookingId == booking.Id, cancellationToken);
            if (slot != null) {
                slot.IsAvailable = true;
                slot.BookingId = null;
                await _timeSlotRepo.UpdateAsync(slot);
            }

            booking.Status = BookingStatus.Cancelled;
            booking.Note = request.Dto?.Reason ?? booking.Note;

            await _bookingRepo.UpdateAsync(booking);

            return true;
        }
    }
}