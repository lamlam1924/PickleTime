namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

/// <summary>
/// Enhanced availability response with dynamic slots and pricing
/// </summary>
public class EnhancedAvailabilityResponseDto
{
    public int FacilityId { get; set; }
    public DateOnly Date { get; set; }
    
    /// <summary>
    /// Facility operating hours for this day
    /// </summary>
    public TimeOnly OpenTime { get; set; }
    public TimeOnly CloseTime { get; set; }
    
    /// <summary>
    /// Is this an overnight facility (closes next day)?
    /// </summary>
    public bool IsOvernightOperation { get; set; }
    
    /// <summary>
    /// Dynamically generated time slots
    /// </summary>
    public List<DynamicSlotDto> Slots { get; set; } = new();
    
    /// <summary>
    /// Booking rules for this facility
    /// </summary>
    public BookingRulesDto Rules { get; set; } = new();
    
    /// <summary>
    /// Price ranges by time period
    /// </summary>
    public Dictionary<string, PriceRangeDto> PriceRanges { get; set; } = new();
    
    /// <summary>
    /// Available discounts
    /// </summary>
    public List<DiscountInfoDto> AvailableDiscounts { get; set; } = new();
    
    public int TotalSlots { get; set; }
    public int AvailableSlots { get; set; }
    public int BookedSlots { get; set; }
}

public class PriceRangeDto
{
    public string Period { get; set; } = null!; // Morning, Afternoon, Evening
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public bool IsPeakTime { get; set; }
}

public class DiscountInfoDto
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public decimal DiscountPercent { get; set; }
    public string ApplicableFor { get; set; } = null!; // "Off-peak", "Bulk booking", "Early bird"
    public List<string>? Conditions { get; set; }
}
