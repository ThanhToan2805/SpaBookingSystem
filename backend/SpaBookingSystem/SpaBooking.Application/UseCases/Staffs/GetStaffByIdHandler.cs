using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetStaffByIdHandler : IRequestHandler<GetStaffByIdQuery, StaffDto?>
    {
        private readonly IStaffRepository _repository;

        public GetStaffByIdHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<StaffDto?> Handle(GetStaffByIdQuery request, CancellationToken cancellationToken)
        {
            var staff = await _repository.GetByIdAsync(request.Id);
            if (staff == null)
                return null;

            return new StaffDto
            {
                Id = staff.Id,
                UserId = staff.UserId,
                Position = staff.Position,
                IsAvailable = staff.IsAvailable,
                UserName = staff.User?.Username
            };
        }
    }
}