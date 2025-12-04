namespace SpaBooking.Contracts.DTOs.Promotions
{
    public class PromotionDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal? DiscountAmount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }
        public bool IsActive { get; set; }
    }
}