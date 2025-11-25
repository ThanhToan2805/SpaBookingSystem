using MediatR;
using SpaBooking.Contracts.DTOs.Categories;
using System;

namespace SpaBooking.Application.Requests.Categories
{
    public class GetCategoryByIdQuery : IRequest<CategoryDto>
    {
        public Guid Id { get; set; }
    }
}