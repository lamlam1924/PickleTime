namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

/// <summary>
/// Response after creating recurring bookings
/// </summary>
public class RecurringBookingResponseDto
{
    /// <summary>
    /// List of successfully created bookings
    /// </summary>
    public List<BookingResponseDto> SuccessfulBookings { get; set; } = new();
    
    /// <summary>
    /// List of dates that failed to book (with reasons)
    /// </summary>
    public List<FailedBookingDto> FailedBookings { get; set; } = new();
    
    /// <summary>
    /// Total amount for all successful bookings
    /// </summary>
    public decimal TotalAmount { get; set; }
    
    /// <summary>
    /// Total discount applied
    /// </summary>
    public decimal TotalDiscount { get; set; }
    
    /// <summary>
    /// Final amount after discounts
    /// </summary>
    public decimal FinalAmount { get; set; }
    
    /// <summary>
    /// Bulk discount percentage applied
    /// </summary>
    public decimal BulkDiscountPercent { get; set; }
    
    public int TotalBookings { get; set; }
    public int SuccessfulCount { get; set; }
    public int FailedCount { get; set; }
}

public class FailedBookingDto
{
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public string Reason { get; set; } = null!;
}
