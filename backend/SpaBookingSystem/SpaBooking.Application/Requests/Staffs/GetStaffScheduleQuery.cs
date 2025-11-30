using MediatR;
using SpaBooking.Contracts.DTOs.Staffs;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Staffs
{
    public class GetStaffScheduleQuery : IRequest<List<StaffScheduleDto>>
    {
        public Guid StaffId { get; set; }
        public DateTime? Date { get; set; } // Nếu null, trả hết lịch
    }
}