namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

public class AvailabilitySlotsResponseDto
{
    public int FacilityId { get; set; }
    public DateOnly Date { get; set; }
    public List<TimeSlotDto> Slots { get; set; } = new();
    public int TotalSlots { get; set; }
}
