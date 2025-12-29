namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

/// <summary>
/// Dynamic time slot with enhanced pricing information
/// </summary>
public class DynamicSlotDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    
    // Court details
    public bool IsIndoor { get; set; }
    public bool HasLighting { get; set; }
    public string? CourtType { get; set; }
    public string? SurfaceName { get; set; }
    public string? Description { get; set; }
    
    public DateOnly SlotDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    
    /// <summary>
    /// Base price per hour
    /// </summary>
    public decimal BasePrice { get; set; }
    
    /// <summary>
    /// Current price after applying time-based pricing
    /// </summary>
    public decimal CurrentPrice { get; set; }
    
    /// <summary>
    /// Time period: Morning, Afternoon, Evening, Night
    /// </summary>
    public string TimePeriod { get; set; } = null!;
    
    /// <summary>
    /// Day type: Weekday or Weekend
    /// </summary>
    public string DayType { get; set; } = null!;
    
    /// <summary>
    /// Is this a peak time slot?
    /// </summary>
    public bool IsPeakTime { get; set; }
    
    /// <summary>
    /// Available discount percentage (0-100)
    /// </summary>
    public decimal DiscountPercent { get; set; }
    
    /// <summary>
    /// Discount reason/description
    /// </summary>
    public string? DiscountReason { get; set; }
    
    /// <summary>
    /// Final price after discount
    /// </summary>
    public decimal FinalPrice { get; set; }
    
    /// <summary>
    /// Is this slot available for booking?
    /// </summary>
    public bool IsAvailable { get; set; }
    
    /// <summary>
    /// Reason if not available (e.g., "Already booked", "Maintenance")
    /// </summary>
    public string? UnavailableReason { get; set; }
}
