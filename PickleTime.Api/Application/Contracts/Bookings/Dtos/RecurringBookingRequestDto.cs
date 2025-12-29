namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

/// <summary>
/// Request to create recurring bookings
/// </summary>
public class RecurringBookingRequestDto
{
    public int CourtId { get; set; }
    public int UserId { get; set; }
    
    /// <summary>
    /// First booking date
    /// </summary>
    public DateOnly StartDate { get; set; }
    
    /// <summary>
    /// Last booking date
    /// </summary>
    public DateOnly EndDate { get; set; }
    
    public TimeOnly StartTime { get; set; }
    public decimal DurationHours { get; set; }
    
    /// <summary>
    /// Recurrence pattern: Weekly, Monthly
    /// </summary>
    public string RecurrencePattern { get; set; } = "Weekly";
    
    /// <summary>
    /// Days of week for weekly pattern (1=Monday, 7=Sunday)
    /// Example: [1, 3, 5] = Monday, Wednesday, Friday
    /// </summary>
    public List<byte>? DaysOfWeek { get; set; }
    
    /// <summary>
    /// Day of month for monthly pattern (1-31)
    /// </summary>
    public byte? DayOfMonth { get; set; }
    
    public string? SpecialRequest { get; set; }
    
    /// <summary>
    /// Apply discount for bulk booking?
    /// </summary>
    public bool ApplyBulkDiscount { get; set; } = true;
}
