using PickleTime.Api.Application.Contracts.Bookings.Dtos;

namespace PickleTime.Api.Application.Contracts.Bookings;

public interface IBookingService
{
    /// <summary>
    /// Get available time slots for a facility on a specific date
    /// </summary>
    Task<AvailabilitySlotsResponseDto> GetAvailableTimeSlotsAsync(int facilityId, DateOnly date, int? courtId = null);
    
    /// <summary>
    /// Get enhanced availability with dynamic slots, pricing tiers, and discounts
    /// </summary>
    Task<EnhancedAvailabilityResponseDto> GetEnhancedAvailabilityAsync(int facilityId, DateOnly date, int? courtId = null);
    
    /// <summary>
    /// Calculate pricing for a booking
    /// </summary>
    Task<PricingResponseDto> CalculatePricingAsync(int courtId, DateOnly date, TimeOnly startTime, decimal durationHours);
    
    /// <summary>
    /// Create a new booking
    /// </summary>
    Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId);
    
    /// <summary>
    /// Get booking by ID
    /// </summary>
    Task<BookingResponseDto?> GetBookingByIdAsync(int bookingId);
    
    /// <summary>
    /// Get user's bookings
    /// </summary>
    Task<List<BookingResponseDto>> GetUserBookingsAsync(int userId, string? status = null);
    
    /// <summary>
    /// Cancel a booking
    /// </summary>
    Task<bool> CancelBookingAsync(int bookingId, int userId, string? reason = null);
    
    /// <summary>
    /// Check if time slots are available
    /// </summary>
    Task<CheckAvailabilityResponseDto> CheckAvailabilityAsync(int courtId, DateOnly date, TimeOnly startTime, TimeOnly endTime);
}