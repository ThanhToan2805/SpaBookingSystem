using MediatR;
using Microsoft.EntityFrameworkCore;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Bookings;
using SpaBooking.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetStaffBookingsHandler : IRequestHandler<GetStaffBookingsQuery, List<BookingDto>>
    {
        private readonly IStaffRepository _staffRepository;

        public GetStaffBookingsHandler(IStaffRepository staffRepository)
        {
            _staffRepository = staffRepository;
        }

        public async Task<List<BookingDto>> Handle(GetStaffBookingsQuery request, CancellationToken cancellationToken)
        {
            var staff = await _staffRepository.Query()
                .Include(s => s.Bookings)
                .FirstOrDefaultAsync(s => s.Id == request.StaffId, cancellationToken);

            if (staff == null) return new List<BookingDto>();

            var bookings = staff.Bookings.AsQueryable();

            if (request.From.HasValue)
                bookings = bookings.Where(b => b.StartAt >= request.From.Value);

            if (request.To.HasValue)
                bookings = bookings.Where(b => b.EndAt <= request.To.Value);

            if (request.Status.HasValue)
                bookings = bookings.Where(b => b.Status == request.Status.Value);

            return bookings.Select(b => new BookingDto
            {
                Id = b.Id,
                CustomerId = b.CustomerId,
                ServiceId = b.ServiceId,
                StaffId = b.StaffId,
                StartAt = b.StartAt,
                EndAt = b.EndAt,
                Status = b.Status.ToString(),
                Note = b.Note,
                CreatedAt = b.CreatedAt
            }).ToList();
        }
    }
}