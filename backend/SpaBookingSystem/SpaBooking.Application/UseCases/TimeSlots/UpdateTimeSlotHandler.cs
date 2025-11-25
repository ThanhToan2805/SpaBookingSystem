using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class UpdateTimeSlotHandler : IRequestHandler<UpdateTimeSlotCommand>
    {
        private readonly ITimeSlotRepository _repository;

        public UpdateTimeSlotHandler(ITimeSlotRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(UpdateTimeSlotCommand request, CancellationToken cancellationToken)
        {
            var slot = await _repository.GetByIdAsync(request.Id);
            if (slot == null) throw new KeyNotFoundException("TimeSlot not found");

            slot.StartAt = request.StartAt;
            slot.EndAt = request.EndAt;
            slot.IsAvailable = request.IsAvailable;

            await _repository.UpdateAsync(slot);

            return Unit.Value;
        }
    }
}