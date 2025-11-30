using MediatR;

namespace SpaBooking.Application.Requests.Staffs
{
    public class CheckStaffAvailabilityQuery : IRequest<bool>
    {
        public Guid StaffId { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
    }
}