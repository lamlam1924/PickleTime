namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

public class PricingResponseDto
{
    public decimal PricePerHour { get; set; }
    public decimal DurationHours { get; set; }
    public decimal TotalAmount { get; set; }
    public string DayType { get; set; } = string.Empty;
    public string TimeRange { get; set; } = string.Empty;
}
