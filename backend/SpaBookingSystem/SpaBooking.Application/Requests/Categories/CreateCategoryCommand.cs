using MediatR;
using System;

namespace SpaBooking.Application.Requests.Categories
{
    public class CreateCategoryCommand : IRequest<Guid>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}