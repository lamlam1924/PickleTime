using System.ComponentModel.DataAnnotations;

namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

public class CreateBookingRequestDto
{
    [Required(ErrorMessage = "Court ID is required")]
    public int CourtId { get; set; }
    
    [Required(ErrorMessage = "Booking date is required")]
    public DateOnly BookingDate { get; set; }
    
    [Required(ErrorMessage = "Start time is required")]
    public TimeOnly StartTime { get; set; }
    
    [Required(ErrorMessage = "Duration is required")]
    [Range(0.5, 8, ErrorMessage = "Duration must be between 0.5 and 8 hours")]
    public decimal DurationHours { get; set; }
    
    [Required(ErrorMessage = "Customer name is required")]
    [StringLength(100, ErrorMessage = "Customer name cannot exceed 100 characters")]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Customer phone is required")]
    [Phone(ErrorMessage = "Invalid phone number format")]
    public string CustomerPhone { get; set; } = string.Empty;
    
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? CustomerEmail { get; set; }
    
    [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters")]
    public string? Notes { get; set; }
}