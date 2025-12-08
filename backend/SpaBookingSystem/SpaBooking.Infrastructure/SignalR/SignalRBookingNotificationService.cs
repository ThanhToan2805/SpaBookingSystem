using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SpaBooking.Application.Interfaces.Notifications;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Infrastructure.SignalR
{
    public class SignalRBookingNotificationService : IBookingNotificationService
    {
        private readonly IHubContext<BookingHub> _hubContext;

        public SignalRBookingNotificationService(IHubContext<BookingHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task BookingCreatedAsync(Booking booking)
        {
            return _hubContext.Clients.All.SendAsync("BookingCreated", new
            {
                bookingId = booking.Id,
                status = booking.Status.ToString(),
                booking.CustomerId,
                booking.StaffId,
                booking.StartAt,
                booking.EndAt,
                booking.FinalPrice
            });
        }

        public Task BookingUpdatedAsync(Booking booking)
        {
            return _hubContext.Clients.All.SendAsync("BookingUpdated", new
            {
                bookingId = booking.Id,
                status = booking.Status.ToString(),
                booking.CustomerId,
                booking.StaffId,
                booking.StartAt,
                booking.EndAt,
                booking.FinalPrice
            });
        }

        public Task BookingCancelledAsync(Booking booking)
        {
            return _hubContext.Clients.All.SendAsync("BookingCancelled", new
            {
                bookingId = booking.Id,
                status = booking.Status.ToString(),
                booking.CustomerId,
                booking.StaffId
            });
        }

        public Task BookingRescheduledAsync(Booking booking)
        {
            return _hubContext.Clients.All.SendAsync("BookingRescheduled", new
            {
                bookingId = booking.Id,
                status = booking.Status.ToString(),
                booking.CustomerId,
                booking.StaffId,
                booking.StartAt,
                booking.EndAt
            });
        }
    }
}