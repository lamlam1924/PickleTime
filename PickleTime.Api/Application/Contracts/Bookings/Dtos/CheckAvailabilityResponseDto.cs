namespace PickleTime.Api.Application.Contracts.Bookings.Dtos;

public class CheckAvailabilityResponseDto
{
    public bool Available { get; set; }
    public string Message { get; set; } = string.Empty;
}
