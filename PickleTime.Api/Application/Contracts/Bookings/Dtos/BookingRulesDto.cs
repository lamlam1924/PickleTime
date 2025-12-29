namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

/// <summary>
/// Booking rules configuration for a facility
/// </summary>
public class BookingRulesDto
{
    /// <summary>
    /// Minimum booking duration in hours (default: 1)
    /// </summary>
    public decimal MinimumDurationHours { get; set; } = 1;
    
    /// <summary>
    /// Slot interval in minutes (30 or 60)
    /// </summary>
    public int SlotIntervalMinutes { get; set; } = 60;
    
    /// <summary>
    /// Maximum consecutive slots allowed in ONE booking (default: 3)
    /// Prevents one user from blocking too many slots
    /// </summary>
    public int MaxConsecutiveSlots { get; set; } = 3;
    
    /// <summary>
    /// Maximum total slots per user per day (default: 4)
    /// Can book multiple times but limited total per day
    /// </summary>
    public int MaxSlotsPerUserPerDay { get; set; } = 4;
    
    /// <summary>
    /// Maximum bookings per user per week (default: 10)
    /// </summary>
    public int MaxBookingsPerUserPerWeek { get; set; } = 10;
    
    /// <summary>
    /// Minimum buffer between bookings in minutes (to prevent small gaps)
    /// </summary>
    public int MinimumBufferMinutes { get; set; } = 0;
    
    /// <summary>
    /// Maximum advance booking days (default: 7)
    /// Regular users can only book 1 week ahead
    /// </summary>
    public int MaxAdvanceBookingDays { get; set; } = 7;
    
    /// <summary>
    /// Minimum advance booking hours (default: 2)
    /// Must book at least 2 hours before play time
    /// </summary>
    public int MinAdvanceBookingHours { get; set; } = 2;
    
    /// <summary>
    /// Allow recurring bookings (weekly/monthly) - for VIP/premium users only
    /// </summary>
    public bool AllowRecurringBookings { get; set; } = false;
    
    /// <summary>
    /// Maximum recurring occurrences (default: 4 weeks for premium)
    /// </summary>
    public int MaxRecurringOccurrences { get; set; } = 4;
    
    /// <summary>
    /// Booking hold time in minutes before auto-release
    /// After selecting slots, user has X minutes to complete payment
    /// </summary>
    public int BookingHoldMinutes { get; set; } = 15;
    
    /// <summary>
    /// Premium user benefits - higher limits
    /// </summary>
    public bool IsPremiumUser { get; set; } = false;
    public int PremiumMaxConsecutiveSlots { get; set; } = 5;
    public int PremiumMaxAdvanceBookingDays { get; set; } = 30;
}
