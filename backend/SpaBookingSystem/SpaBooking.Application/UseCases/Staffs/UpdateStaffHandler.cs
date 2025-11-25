using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class UpdateStaffHandler : IRequestHandler<UpdateStaffCommand, StaffDto>
    {
        private readonly IStaffRepository _repository;

        public UpdateStaffHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<StaffDto> Handle(UpdateStaffCommand request, CancellationToken cancellationToken)
        {
            var staff = await _repository.GetByIdAsync(request.Id);
            if (staff == null)
                throw new KeyNotFoundException("Staff not found");

            staff.Position = request.Position;
            staff.IsAvailable = request.IsAvailable;

            await _repository.UpdateAsync(staff);

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