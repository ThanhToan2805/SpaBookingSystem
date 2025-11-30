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
    public class GetStaffByPositionHandler : IRequestHandler<GetStaffByPositionQuery, List<StaffDto>>
    {
        private readonly IStaffRepository _repository;

        public GetStaffByPositionHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<StaffDto>> Handle(GetStaffByPositionQuery request, CancellationToken cancellationToken)
        {
            var query = _repository.Query()
                                   .Where(s => s.Position == request.Position);

            var staffList = await Task.FromResult(query.ToList());

            return staffList.Select(s => new StaffDto
            {
                Id = s.Id,
                UserId = s.UserId,
                Position = s.Position,
                IsAvailable = s.IsAvailable,
                UserName = s.User?.Username
            }).ToList();
        }
    }
}