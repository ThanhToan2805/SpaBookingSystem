namespace SpaBooking.Domain.Entities
{
    public class Service
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid CategoryId { get; set; }        // foreign key
        public Category Category { get; set; } = null!; // navigation property
    }
}