using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using SpaBooking.Contracts.DTOs.Staffs;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class GetAllStaffsHandler : IRequestHandler<GetAllStaffsQuery, IEnumerable<StaffDto>>
    {
        private readonly IStaffRepository _repository;

        public GetAllStaffsHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<StaffDto>> Handle(GetAllStaffsQuery request, CancellationToken cancellationToken)
        {
            var staffs = await _repository.GetAllAsync();
            return staffs.Select(s => new StaffDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Position = s.Position,
                IsAvailable = s.IsAvailable,
                UserName = s.User?.Username
            });
        }
    }
}