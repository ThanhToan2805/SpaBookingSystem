using MediatR;
using SpaBooking.Contracts.DTOs.Services;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Services
{
    public class GetAllServicesQuery : IRequest<List<ServiceDto>> { }
}