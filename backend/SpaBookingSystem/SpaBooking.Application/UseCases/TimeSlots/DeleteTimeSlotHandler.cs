using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class DeleteTimeSlotHandler : IRequestHandler<DeleteTimeSlotCommand>
    {
        private readonly ITimeSlotRepository _repository;

        public DeleteTimeSlotHandler(ITimeSlotRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteTimeSlotCommand request, CancellationToken cancellationToken)
        {
            var slot = await _repository.GetByIdAsync(request.Id);
            if (slot == null) throw new KeyNotFoundException("TimeSlot not found");

            await _repository.DeleteAsync(slot);
            return Unit.Value;
        }
    }
}