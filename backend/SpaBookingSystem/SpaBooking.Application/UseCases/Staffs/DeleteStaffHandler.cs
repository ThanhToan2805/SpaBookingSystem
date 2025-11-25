using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Staffs;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.Staffs
{
    public class DeleteStaffHandler : IRequestHandler<DeleteStaffCommand, bool>
    {
        private readonly IStaffRepository _repository;

        public DeleteStaffHandler(IStaffRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeleteStaffCommand request, CancellationToken cancellationToken)
        {
            var staff = await _repository.GetByIdAsync(request.Id);
            if (staff == null)
                return false;

            await _repository.DeleteAsync(staff);
            return true;
        }
    }
}