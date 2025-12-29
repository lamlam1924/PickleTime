using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PickleTime.Api.Application.Contracts.Bookings;
using PickleTime.Api.Application.Contracts.Bookings.Dtos;
using System.Security.Claims;

namespace PickleTime.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    /// <summary>
    /// Get available time slots for a facility
    /// </summary>
    [HttpGet("available-slots")]
    public async Task<ActionResult<AvailabilitySlotsResponseDto>> GetAvailableSlots(
        [FromQuery] int facilityId,
        [FromQuery] DateOnly date,
        [FromQuery] int? courtId = null)
    {
        try
        {
            var result = await _bookingService.GetAvailableTimeSlotsAsync(facilityId, date, courtId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// Get enhanced availability with dynamic slots, pricing tiers, and discounts
    /// </summary>
    [HttpGet("enhanced-availability")]
    public async Task<ActionResult<EnhancedAvailabilityResponseDto>> GetEnhancedAvailability(
        [FromQuery] int facilityId,
        [FromQuery] DateOnly date,
        [FromQuery] int? courtId = null)
    {
        try
        {
            var result = await _bookingService.GetEnhancedAvailabilityAsync(facilityId, date, courtId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Calculate pricing for a booking
    /// </summary>
    [HttpGet("pricing")]
    public async Task<ActionResult<PricingResponseDto>> CalculatePricing(
        [FromQuery] int courtId,
        [FromQuery] DateOnly date,
        [FromQuery] TimeOnly startTime,
        [FromQuery] decimal durationHours)
    {
        try
        {
            var result = await _bookingService.CalculatePricingAsync(courtId, date, startTime, durationHours);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Create a new booking
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<BookingResponseDto>> CreateBooking([FromBody] CreateBookingRequestDto request)
    {
        try
        {
            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var result = await _bookingService.CreateBookingAsync(request, userId);
            return CreatedAtAction(nameof(GetBookingById), new { id = result.BookingId }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the booking", error = ex.Message });
        }
    }

    /// <summary>
    /// Get booking by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<BookingResponseDto>> GetBookingById(int id)
    {
        try
        {
            var result = await _bookingService.GetBookingByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Booking not found" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get current user's bookings
    /// </summary>
    [HttpGet("my-bookings")]
    [Authorize]
    public async Task<ActionResult<List<BookingResponseDto>>> GetMyBookings([FromQuery] string? status = null)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var result = await _bookingService.GetUserBookingsAsync(userId, status);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Cancel a booking
    /// </summary>
    [HttpPost("{id}/cancel")]
    [Authorize]
    public async Task<ActionResult> CancelBooking(int id, [FromBody] CancelBookingRequest? request = null)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "User not authenticated" });
            }

            var result = await _bookingService.CancelBookingAsync(id, userId, request?.Reason);
            if (!result)
                return NotFound(new { message = "Booking not found or cannot be cancelled" });

            return Ok(new { message = "Booking cancelled successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Check availability of time slots
    /// </summary>
    [HttpGet("check-availability")]
    public async Task<ActionResult<CheckAvailabilityResponseDto>> CheckAvailability(
        [FromQuery] int courtId,
        [FromQuery] DateOnly date,
        [FromQuery] TimeOnly startTime,
        [FromQuery] TimeOnly endTime)
    {
        try
        {
            var result = await _bookingService.CheckAvailabilityAsync(courtId, date, startTime, endTime);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public class CancelBookingRequest
{
    public string? Reason { get; set; }
}