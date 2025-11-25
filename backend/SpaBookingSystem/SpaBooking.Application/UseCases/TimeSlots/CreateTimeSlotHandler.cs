using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.TimeSlots;
using SpaBooking.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace SpaBooking.Application.UseCases.TimeSlots
{
    public class CreateTimeSlotHandler : IRequestHandler<CreateTimeSlotCommand, Guid>
    {
        private readonly ITimeSlotRepository _repository;

        public CreateTimeSlotHandler(ITimeSlotRepository repository)
        {
            _repository = repository;
        }

        public async Task<Guid> Handle(CreateTimeSlotCommand request, CancellationToken cancellationToken)
        {
            var slot = new TimeSlot
            {
                StaffId = request.StaffId,
                StartAt = request.StartAt,
                EndAt = request.EndAt,
                IsAvailable = true
            };

            await _repository.AddAsync(slot);

            return slot.Id;
        }
    }
}