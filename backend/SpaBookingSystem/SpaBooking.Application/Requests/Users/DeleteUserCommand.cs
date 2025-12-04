using MediatR;

namespace SpaBooking.Application.Requests.Users
{
    public class DeleteUserCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}