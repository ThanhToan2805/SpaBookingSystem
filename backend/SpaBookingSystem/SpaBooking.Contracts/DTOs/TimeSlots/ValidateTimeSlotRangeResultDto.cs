namespace SpaBooking.Contracts.DTOs.TimeSlots
{
    public class ValidateTimeSlotRangeResultDto
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}