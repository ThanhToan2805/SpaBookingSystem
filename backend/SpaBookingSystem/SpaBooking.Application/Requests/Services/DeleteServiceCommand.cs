using MediatR;
using System;

namespace SpaBooking.Application.Requests.Services
{
    public class DeleteServiceCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}