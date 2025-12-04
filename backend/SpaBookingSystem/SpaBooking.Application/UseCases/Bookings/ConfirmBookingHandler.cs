using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class ConfirmBookingHandler : IRequestHandler<ConfirmBookingCommand, BookingDto>
    {
        private readonly IBookingRepository _bookingRepo;

        public ConfirmBookingHandler(IBookingRepository bookingRepo)
        {
            _bookingRepo = bookingRepo;
        }

        public async Task<BookingDto> Handle(ConfirmBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _bookingRepo.Query()
                .FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);

            if (booking == null)
                throw new Exception("Booking not found.");

            if (booking.Status == BookingStatus.Cancelled)
                throw new Exception("Cannot confirm a cancelled booking.");

            if (booking.Status == BookingStatus.Completed)
                throw new Exception("Cannot confirm a completed booking.");

            if (booking.Status == BookingStatus.NoShow)
                throw new Exception("Cannot confirm a no show booking.");

            booking.Status = BookingStatus.Confirmed;

            await _bookingRepo.UpdateAsync(booking);

            return new BookingDto
            {
                Id = booking.Id,
                CustomerId = booking.CustomerId,
                ServiceId = booking.ServiceId,
                StaffId = booking.StaffId,
                PromotionId = booking.PromotionId,
                FinalPrice = booking.FinalPrice,
                StartAt = booking.StartAt,
                EndAt = booking.EndAt,
                CreatedAt = booking.CreatedAt,
                Note = booking.Note,
                Status = booking.Status.ToString()
            };
        }
    }
}