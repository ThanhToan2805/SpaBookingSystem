using MediatR;
using SpaBooking.Application.Interfaces.Repositories;
using SpaBooking.Application.Requests.Bookings;

namespace SpaBooking.Application.UseCases.Bookings
{
    public class DeleteBookingHandler : IRequestHandler<DeleteBookingCommand, bool>
    {
        private readonly IBookingRepository _repo;

        public DeleteBookingHandler(IBookingRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(DeleteBookingCommand request, CancellationToken cancellationToken)
        {
            var booking = await _repo.GetByIdAsync(request.Id);
            if (booking == null) return false;

            await _repo.DeleteAsync(booking);
            return true;
        }
    }
}