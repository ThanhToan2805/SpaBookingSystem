using MediatR;
using System;

namespace SpaBooking.Application.Requests.Categories
{
    public class UpdateCategoryCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}