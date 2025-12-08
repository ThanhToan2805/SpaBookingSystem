using System;
using System.Threading.Tasks;
using SpaBooking.Domain.Entities;

namespace SpaBooking.Application.Interfaces.Notifications
{
    public interface IBookingNotificationService
    {
        Task BookingCreatedAsync(Booking booking);
        Task BookingUpdatedAsync(Booking booking);
        Task BookingCancelledAsync(Booking booking);
        Task BookingRescheduledAsync(Booking booking);
    }
}