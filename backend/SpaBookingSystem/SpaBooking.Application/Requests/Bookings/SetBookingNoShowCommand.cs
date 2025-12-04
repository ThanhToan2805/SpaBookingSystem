using MediatR;

namespace SpaBooking.Application.Requests.Bookings
{
    public class SetBookingNoShowCommand : IRequest<bool>
    {
        public Guid BookingId { get; set; }
        public string? Note { get; set; } // Tuỳ chọn thêm ghi chú
    }
}