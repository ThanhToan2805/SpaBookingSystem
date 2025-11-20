using MediatR;
using System;

namespace SpaBooking.Application.Requests.Services
{
    public class CreateServiceCommand : IRequest<Guid>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public string? ImageUrl { get; set; }
        public Guid CategoryId { get; set; }

    }
}