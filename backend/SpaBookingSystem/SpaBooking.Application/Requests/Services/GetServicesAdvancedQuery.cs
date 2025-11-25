using MediatR;
using SpaBooking.Contracts.DTOs.Services;
using System;
using System.Collections.Generic;

namespace SpaBooking.Application.Requests.Services
{
    public class GetServicesAdvancedQuery : IRequest<IEnumerable<ServiceDto>>
    {
        public string? SearchKeyword { get; set; }
        public Guid? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? MinDuration { get; set; }
        public int? MaxDuration { get; set; }
        public string? SortBy { get; set; }   // Name / Price / Duration
        public bool SortDesc { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}