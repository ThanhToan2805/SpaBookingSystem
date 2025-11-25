using MediatR;
using System;

namespace SpaBooking.Application.Requests.Staffs
{
    public class DeleteStaffCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}