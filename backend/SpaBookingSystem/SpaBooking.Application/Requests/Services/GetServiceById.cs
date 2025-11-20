using MediatR;
using SpaBooking.Contracts.DTOs.Services;
using System;

namespace SpaBooking.Application.Requests.Services
{
    public class GetServiceByIdQuery : IRequest<ServiceDto?>
    {
        public Guid Id { get; set; }
    }
}