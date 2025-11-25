using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class CreateStaffHandler : IRequestHandler<CreateStaffCommand, StaffDto>
    {
        private readonly IStaffRepository _repository;

        public CreateStaffHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<StaffDto> Handle(CreateStaffCommand request, CancellationToken cancellationToken)
        {
            var staff = new Domain.Entities.Staff
            {
                UserId = request.UserId,
                Position = request.Position,
                IsAvailable = request.IsAvailable
            };

            await _repository.AddAsync(staff);

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