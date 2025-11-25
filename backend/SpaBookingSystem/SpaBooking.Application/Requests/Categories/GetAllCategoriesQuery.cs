using MediatR;
using SpaBooking.Contracts.DTOs.Categories;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Categories
{
    public class GetAllCategoriesQuery : IRequest<List<CategoryDto>>
    {
    }
}