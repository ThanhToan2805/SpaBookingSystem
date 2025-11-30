namespace SpaBooking.Contracts.DTOs.TimeSlots
{
    public class TimeSlotGroupDto
    {
        public List<TimeSlotDto> Slots { get; set; } = new List<TimeSlotDto>();
        public DateTime StartAt => Slots.First().StartAt;
        public DateTime EndAt => Slots.Last().EndAt;
    }
}