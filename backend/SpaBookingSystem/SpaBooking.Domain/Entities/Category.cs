using System;
using System.Collections.Generic;

namespace SpaBooking.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        // Quan hệ 1-n với Service
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}