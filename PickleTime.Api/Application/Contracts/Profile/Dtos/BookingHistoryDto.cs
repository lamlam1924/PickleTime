namespace PickleTime.Api.Application.Contracts.Profile.Dtos;

public class BookingHistoryDto
{
    public int BookingId { get; set; }
    public string BookingNumber { get; set; } = string.Empty;
    public DateOnly BookingDate { get; set; }
    public string FacilityName { get; set; } = string.Empty;
    public string CourtName { get; set; } = string.Empty;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal TotalAmount { get; set; }
    public string BookingStatus { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
