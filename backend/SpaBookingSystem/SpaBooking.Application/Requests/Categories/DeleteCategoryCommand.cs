using MediatR;
using System;

namespace SpaBooking.Application.Requests.Categories
{
    public class DeleteCategoryCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}