namespace SpaBooking.Domain.Entities
{
    public enum PaymentStatus { Pending, Completed, Failed, Cancelled }

    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; } = null!;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = null!; // e.g., Cash, Card, Online
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string? TransactionCode { get; set; } // mã giao dịch từ ngân hàng
        public string InvoiceCode { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}