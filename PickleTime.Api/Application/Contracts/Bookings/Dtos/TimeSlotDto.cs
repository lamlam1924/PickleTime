namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

public class TimeSlotDto
{
    public int TimeSlotId { get; set; }
    public int CourtId { get; set; }
    public string CourtName { get; set; } = string.Empty;
    
    // Court details
    public bool IsIndoor { get; set; }
    public bool HasLighting { get; set; }
    public string? CourtType { get; set; }
    public string? SurfaceName { get; set; }
    
    public DateOnly SlotDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TimeSlotStatusId { get; set; }
}
